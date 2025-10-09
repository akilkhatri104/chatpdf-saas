import { createTransport, TransportOptions } from "nodemailer";
import "dotenv/config";

export default async function sendMail({
    to,
    subject,
    body,
}: {
    to: string;
    subject: string;
    body: string;
}) {
    try {
        const transportOptions: TransportOptions = {
            host: process.env.SMTP_HOST!,
            port: process.env.SMTP_PORT!,
            auth: {
                user: process.env.SMTP_USERNAME!,
                pass: process.env.SMTP_PASSWORD!,
            },
        };
        const transporter = createTransport(transportOptions);
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_SENDER_NAME}" ${process.env.SMTP_SENDER_MAIL}`,
            to,
            subject,
            html: body,
        });
    
        return info
    } catch (error) {
        console.error("sendMail:: ",error); 
        
    }
}
