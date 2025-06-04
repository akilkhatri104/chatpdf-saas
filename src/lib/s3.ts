import AWS from 'aws-sdk'

export async function uploadToS3(file : File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        })

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            },
            region: process.env.NEXT_PUBLIC_AWS_REGION,
        })  
        
        const fileKey = `uploads/${Date.now().toString()}-${file.name.replace(' ','-')}`

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: fileKey,
            Body: file,
        }

        const upload = s3.putObject(params).on('httpUploadProgress',e => {
            console.log(`Upload progress: ${Math.round((e.loaded / e.total) * 100).toString()}%`);
            
        }).promise()

        await upload
        .then(data => {
            console.log('File uploaded successfully:', fileKey);
            
        })

        return Promise.resolve({
            fileKey,
            fileName: file.name,
        })
    } catch (error) {
        console.error('Error configuring AWS SDK:', error);
        throw new Error('Failed to configure AWS SDK');
        
    }
}

export function getFileUrl(fileKey: string) {
    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;
    return url;
}