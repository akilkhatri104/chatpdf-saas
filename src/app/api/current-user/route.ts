import { currentUser, User } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user: User | null = await currentUser();
        if (!user) {
            return NextResponse.json({
                data: {},
                error: "User not logged in",
                success: false,
            },{status:400});
        }
        console.log(user.emailAddresses);

        return NextResponse.json(
            {
                data: user,
                message: "User fetched succesfully",
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: error.message,
                data: {},
                success: false,
            },
            { status: 500 }
        );
    }
}
