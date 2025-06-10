import {
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NodeJsClient } from "@smithy/types";
import fs from 'fs'
import { Readable } from "stream";
import path from "path";
import os from 'os'

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
        
        const tempDir = os.tmpdir()
        if(!fs.existsSync('tmp')) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const filePath = path.join(tempDir, `${fileKey.replace('/', '-')}`); // Save to a temporary file
        // `/tmp/${fileKey.replace('/','-')}.pdf`

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