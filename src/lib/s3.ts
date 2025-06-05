import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadToS3 = async (file: File) => {
    try {
        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
            },
            region: process.env.NEXT_PUBLIC_AWS_REGION!,requestChecksumCalculation: "WHEN_REQUIRED"
        });
    
        const fileKey = `uploads/${Date.now().toString()}-${file.name.replace(' ','-')}`
    
        const command = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: fileKey,
            Body: file,
        });
    
        const res = await s3.send(command)
        console.log("S3 upload response: ",res);
        return {
            fileKey: fileKey,
            fileName: file.name,
            status: res.$metadata.httpStatusCode,
            success: res.$metadata.httpStatusCode < 400
        }
    } catch (error: any) {
        console.error("Error :: uploadToS3:: ",error);
        throw new Error("(uploadToS3) Error while uploading to S3",error.message)
        
    }
    
};


export function getS3Url(fileKey: string) {
    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;
    return url;
}
