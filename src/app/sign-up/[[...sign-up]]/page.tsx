import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white">
            <SignUp />
        </div>
    )
}