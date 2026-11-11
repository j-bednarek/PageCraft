const crypto = require('crypto');
const {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED'
});

const BUCKET = process.env.R2_BUCKET;
const UPLOAD_URL_TTL = 5 * 60;

const EXTENSIONS = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
const ALLOWED_TYPES = Object.keys(EXTENSIONS);

function userPrefix(userId) {
    return `users/${userId}/`;
}

function pagePrefix(userId, pageId) {
    return `${userPrefix(userId)}pages/${pageId}/`;
}

async function createUploadUrl(prefix, contentType) {
    const key = `${prefix}${crypto.randomBytes(12).toString('hex')}.${EXTENSIONS[contentType]}`;
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(s3, command, {
        expiresIn: UPLOAD_URL_TTL,
        signableHeaders: new Set(['content-type'])
    });
    return { uploadUrl, publicUrl: `${process.env.R2_PUBLIC_URL}/${key}` };
}

async function removePrefix(prefix) {
    let continuationToken;
    do {
        const list = await s3.send(new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: prefix,
            ContinuationToken: continuationToken
        }));
        for (const object of list.Contents ?? []) {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: object.Key }));
        }
        continuationToken = list.NextContinuationToken;
    } while (continuationToken);
}

module.exports = { ALLOWED_TYPES, userPrefix, pagePrefix, createUploadUrl, removePrefix };