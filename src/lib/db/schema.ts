import {
    text,
    serial,
    timestamp,
    varchar,
    integer,
    pgTable,
    pgEnum,
    boolean,
} from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    pdfName: text("pdf_name").notNull(),
    chatName: text("chat_name"),
    pdfUrl: text("pdf_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    fileKey: text("file_key").notNull(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    chatId: integer("chat_id")
        .references(() => chats.id)
        .notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    role: text("role", { enum: ["system", "user"] }).notNull(),
});

export const subscriptionStatusEnum = pgEnum('subscription_status_enum',['created','authenticated','active','pending','halted','cancelled','paused','expired','completed'])

export const userSubscriptions = pgTable("user_subscriptions", {
    id: serial("id").primaryKey(), 
    userId: varchar("user_id", { length: 256 }).notNull().unique(), 
    razorpayCustomerId: text("razorpay_customer_id").notNull().unique(),
    razorpaySubscriptionId: text("razorpay_subscription_id").unique(),
    razorpayPlanId: text("razorpay_plan_id").notNull(),
    subscriptionStatus: subscriptionStatusEnum('subscription_status').default('created'), 
    currentStart: timestamp("current_start"),
    currentEnd: timestamp("current_end"),
    chargeAt: timestamp('charge_at'),
    paymentsLocked: boolean('payments_locked').default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export type DrizzleUserSubscription = typeof userSubscriptions.$inferSelect;
