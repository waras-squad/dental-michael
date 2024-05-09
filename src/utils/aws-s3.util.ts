import { customError } from '@/helpers';
import { env } from '@/validators';
import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const REGION = 'ap-southeast-3';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
  endpoint: env.AWS_BUCKET_ENDPOINT,
  region: REGION,
});

/**
 * Creates a new S3 bucket with the specified configuration.
 */
export const createBucket = async () => {
  try {
    const res = await s3Client.send(
      new CreateBucketCommand({
        ACL: 'public-read',
        Bucket: env.AWS_S3_BUCKET,
        CreateBucketConfiguration: {
          LocationConstraint: REGION,
        },
      })
    );
    console.log(`New bucket is created on ${res.Location}`);

    return res.Location;
  } catch (error) {
    console.error(error);
  }
};

export const uploadFiles = async (files: File[]) => {
  const paths: string[] = [];
  try {
    for (const file of files) {
      const newFile = new File([file], file.name.replaceAll(' ', '-'), {
        type: file.type,
        lastModified: new Date().getTime(),
      });

      const key = `${new Date().toISOString()}-${newFile.name}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.AWS_S3_BUCKET,
          Key: key,
          Body: (await newFile.arrayBuffer()) as unknown as File,
          ACL: 'public-read',
          ContentType: file.type,
        })
      );

      const path = `https://${
        env.AWS_S3_BUCKET
      }.${env.AWS_BUCKET_ENDPOINT.replace('https://', '')}/${key}`;

      paths.push(path);
    }

    return paths;
  } catch (error) {
    console.error(`Failed to upload files \n
      ${error}`);
    return customError(500, 'Failed to upload files');
  }
};

console.log('Setup for AWS s3 success');
