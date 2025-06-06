import {
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NodeJsClient } from "@smithy/types";
import fs from 'fs'
import { Readable } from "stream";
import path from "path";

export const downloadFromS3 = async (fileKey : string) => {
    return new Promise(async (resolve,reject) => {
        try {
        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
            },
            region: process.env.NEXT_PUBLIC_AWS_REGION!,requestChecksumCalculation: "WHEN_REQUIRED"
        }) as NodeJsClient<S3Client>;

        const res = await s3.send(
            new GetObjectCommand({
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                Key: fileKey
            })
        )
        
        const publicDir = path.join(process.cwd(),'public')
        const tmpDir = path.join(publicDir,'tmp')
        const filePath = path.join(tmpDir,`${fileKey.replace('/','-')}.pdf`)

        if(res.Body instanceof Readable){
            const file = fs.createWriteStream(filePath)
            file.on('open',function ()  {
                res.Body?.pipe(file).on('finish',() => {
                    resolve(filePath)
                })
            })
        }
    } catch (error) {
        console.error("Error :: downloadFromS3 :: ",error.message);
        return reject(error)
    }
    })
}