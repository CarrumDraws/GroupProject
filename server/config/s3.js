const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async (file) => {
  let fileid = `${uuidv4()}`;
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileid,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return { data, key: fileid }; // Return the unique key along with the data
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getFileUrl = async (fileKey) => {
  const getObjectParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand(getObjectParams),
      { expiresIn: 604800 }
    ); // URL expires in 7 days
    return url;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { uploadFileToS3, getFileUrl };
