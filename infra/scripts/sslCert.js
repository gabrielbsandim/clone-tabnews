import AWS from "aws-sdk";

const s3 = new AWS.S3();

async function handleGetCert() {
  try {
    const params = {
      Bucket: "tabnews",
      Key: "cert/global-bundle.pem",
    };

    const data = await s3.getObject(params).promise();

    return data.Body.toString();
  } catch (error) {
    console.warn("Error fetching certificate from S3:", error);
  }
}

export default { handleGetCert };
