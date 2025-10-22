"use server";
import { db } from "@/lib/db";
import { chats, userSubscriptions } from "@/lib/db/schema";
import { handleError } from "@/lib/utils";
import { currentUser, User } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import Razorpay from "razorpay";
import { Customers } from "razorpay/dist/types/customers";
import { Subscriptions } from "razorpay/dist/types/subscriptions";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createSubscription(): Promise<{
    error?: string;
    customerId?: string;
    subscriptionId?: string;
}> {
    try {
        const user: User | null = await currentUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const [existingSubscription] = await db
            .select()
            .from(userSubscriptions)
            .where(eq(userSubscriptions.userId, user.id))
            .limit(1);

        if (existingSubscription) {
            if (
                existingSubscription.subscriptionStatus === "created" &&
                typeof existingSubscription.razorpayCustomerId ===
                    "string" &&
                typeof existingSubscription.razorpaySubscriptionId ===
                    "string"
            ) {
                return {
                    subscriptionId:
                        existingSubscription.razorpaySubscriptionId,
                    customerId: existingSubscription.razorpayCustomerId,
                };
            } else if (existingSubscription.subscriptionStatus === 'active' && await isSubscriptionActive()) {
                throw new Error("User already has a subscription");
            } else {
                await db.delete(userSubscriptions).where(eq(userSubscriptions.id,existingSubscription.id))
            }
        }

        const customerOptions: Customers.RazorpayCustomerCreateRequestBody = {
            name: user?.firstName + " " + user?.lastName,
            notes: {
                userId: user.id,
            },
        };

        const customer = await (razorpay.customers.create(
            customerOptions
        ) as Promise<Customers.RazorpayCustomer>);

        const planId = process.env.RAZORPAY_PRO_PLAN_ID!;
        if (!planId) {
            throw new Error("Razorpay planId not configured");
        }

        const subscriptionOptions: Subscriptions.RazorpaySubscriptionCreateRequestBody =
            {
                plan_id: planId,
                total_count: 12,
                quantity: 1,
                customer_notify: 1,
                notes: {
                    customerId: customer.id,
                },
            };
        const subscription = await (razorpay.subscriptions.create(
            subscriptionOptions
        ) as Promise<Subscriptions.RazorpaySubscription>);

        await db.insert(userSubscriptions).values({
            razorpayCustomerId: customer.id,
            razorpayPlanId: planId,
            razorpaySubscriptionId: subscription.id,
            userId: user.id,
        });

        return {
            subscriptionId: subscription.id,
            customerId: customer.id,
        };
    } catch (error) {
        console.error("RAZORPAY_CREATE_SUBSCRIPTION_ERROR :", error);
        return {
            error: error instanceof Error ? error.message : "An Error Occured",
        };
    }
}

export async function syncRazorpayDataToDB(subscriptionId: string,paymentsLocked: boolean = true) {
    try {
        const subExistsOnDB = await db
            .select()
            .from(userSubscriptions)
            .where(
                eq(userSubscriptions.razorpaySubscriptionId, subscriptionId)
            );
        if (!subExistsOnDB || subExistsOnDB.length === 0)
            throw new Error("Subscription not found on our database");

        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        if (!subscription) {
            throw new Error("Error fetching subscription from Razorpay");
        }

        db.update(userSubscriptions).set({
            subscriptionStatus: subscription.status,
            currentStart: new Date(subscription?.current_start as number * 1000),
            currentEnd: new Date(subscription.current_end as number * 1000),
            chargeAt: new Date(subscription.start_at as number * 1000),
            paymentsLocked,
        });

        return {
            razorpaySubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            currentStart: subscription.current_end,
            currentEnd: subscription.current_end,
            error: null
        };
    } catch (error) {
        console.error(`RAZORPAY_CREATE_SUBSCRIPTION_ERROR : ${error}`);
        return handleError(error);
    }
}


export async function getSubscriptionIDForLoggedInUser() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not logged in");
        }
        const userId = user.id;

        
        

        const res = await db
            .select()
            .from(userSubscriptions)
            .where(eq(userSubscriptions.userId, userId))
            .limit(1);

        if (!res || res.length === 0)
            throw new Error("No subscription found with the give user id");
        return {
            subscriptionId: res[0].razorpaySubscriptionId as string,
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "An Error Occured",
        };
    }
}
export async function getSubscriptionForLoggedInUser() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not logged in");
        }
        const userId = user.id;
        const result = await db.execute(sql`SELECT EXISTS(SELECT 1 FROM ${userSubscriptions} WHERE ${userSubscriptions.userId} = ${userId})`)
        if(result.rows.length === 0 || result.rows[0].exists === false){
            throw new Error("Subscription does not exist")
        }

        const [subscription] = await db
            .select()
            .from(userSubscriptions)
            .where(eq(userSubscriptions.userId, userId))
            .limit(1);

        if(!subscription || subscription === undefined)
            throw new Error("Subscription not found")
        return subscription
    } catch (error) {
        throw error
    }
}

export async function getSubscriptionById(subscriptionId : string){
    try {
        const subscription = await db.select().from(userSubscriptions).where(eq(userSubscriptions.razorpaySubscriptionId, subscriptionId))
        if(!subscription || subscription.length === 0)
            throw new Error("Subscription not found in the database")
        return subscription[0]
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function userHasActiveSubscription() {
    try {
        const user = await currentUser();
        if (!user) return false;

        const sub = await db
            .select()
            .from(userSubscriptions)
            .where(
                and(
                    eq(userSubscriptions.userId, user.id),
                    eq(userSubscriptions.subscriptionStatus, "active")
                )
            );

        if (sub && sub.length > 0) return true;

        return false;
    } catch (error) {
        console.error("userHasActiveSubscription :: ", error);
        return false;
    }
}

export async function isSubscriptionActive(){
    try {
        const user = await currentUser()
        if(!user)
            return false

        const [subscription] = await db.select({currentEnd: userSubscriptions.currentEnd}).from(userSubscriptions).where(eq(userSubscriptions.userId,user.id)).limit(1)
        if(!subscription || !subscription.currentEnd)
            return false

        const gracePeriod = Number.parseInt(process.env.GRACE_PERIOD_DAYS!)
        const gracePeriodInMs = gracePeriod * 24 * 60 * 60 * 1000
        
        const endDate = new Date(subscription.currentEnd)
        const expiryWithGracePeriod = endDate.getTime() + gracePeriodInMs
        const now = new Date().getTime()

        return now < expiryWithGracePeriod
    } catch (error) {
        console.error(error)
        return false
    }
}

export async function hasReachedFreePlanLimit() {
    try {
        const user = await currentUser();
        if (!user) return true;
        const hasActiveSub = await isSubscriptionActive();

        if (!hasActiveSub) {
            const lastChat = await db
                .select()
                .from(chats)
                .where(eq(chats.userId, user.id))
                .orderBy(desc(chats.createdAt))
                .limit(1);

            if (lastChat && lastChat.length === 1) {
                const timediference =
                    new Date().getTime() - lastChat[0].createdAt.getTime();
                if (timediference < 24 * 60 * 60 * 1000) return true;
            }
        }
        return false;
    } catch (error) {
        console.error("hasReachedFreePlanLimist :: ", error);
        return true;
    }
}

export async function cancelAllSubscriptions() {
    try {
        const subscriptions = await razorpay.subscriptions.all();

        subscriptions.items.forEach(async (sub) => {
            await razorpay.subscriptions.cancel(sub.id);
        });
    } catch (error) {
        console.error(error);
    }
}

export async function lockPaymentsOnSubscription(subscriptionId: string) {
    try {
        await db
            .update(userSubscriptions)
            .set({
                paymentsLocked: true,
            })
            .where(
                eq(userSubscriptions.razorpaySubscriptionId, subscriptionId)
            );
    } catch (error) {
        console.error(error)
    }
}
export async function unlockPaymentsOnSubscription(subscriptionId: string) {
    try {
        await db
            .update(userSubscriptions)
            .set({
                paymentsLocked: false,
            })
            .where(
                eq(userSubscriptions.razorpaySubscriptionId, subscriptionId)
            );
    } catch (error) {
        console.error(error)
    }
}

export async function isPaymentLocked(subscriptionId: string){
    try {
        const sub = await db.select().from(userSubscriptions).where(eq(userSubscriptions.razorpaySubscriptionId,subscriptionId)).limit(1)
        if(!sub || sub.length === 0)
            return true
        
        return !!sub[0].paymentsLocked
    } catch (error) {
        console.error(error)
        return true
    }
}

export async function cancelSubscriptionById(subscriptionId: string){
    try {
        const data: Subscriptions.RazorpaySubscription = await razorpay.subscriptions.cancel(subscriptionId)

        if(!data.id){
            throw new Error("Some error occured while canceling subscription")
        }
        
        await db.update(userSubscriptions).set({
            subscriptionStatus: data.status,
            currentStart: new Date(data?.current_start as number * 1000),
            currentEnd: new Date(data.current_end as number * 1000),
            chargeAt: new Date(data.charge_at as number * 1000),
            paymentsLocked: true
        });
        
        
        return {
            error: null
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "An Error Occured"
        }
    }
}