import {
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
  DeleteObjectOutput
} from "@aws-sdk/client-s3";
import { NodeJsClient } from "@smithy/types";
import fs from 'fs'
import { Readable } from "stream";
import path from "path";
import os from 'os'
import { FileKey } from "lucide-react";

const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
            },
            region: process.env.NEXT_PUBLIC_AWS_REGION!,requestChecksumCalculation: "WHEN_REQUIRED"
        }) as NodeJsClient<S3Client>;

export const downloadFromS3 = async (fileKey : string) => {
    return new Promise(async (resolve,reject) => {
        try {
        

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

export const deleteFromS3 = async (fileKey:string) =>{
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: fileKey
        })

        const res: DeleteObjectOutput = await s3.send(command)
        if(!res){
            throw new Error('Error while deleting object')
        }

        return {
            message: 'Object deleted from s3',
            success: true,
        }

    } catch (error) {
        return {
            error: error.message,
            success: false
        }
    }
}