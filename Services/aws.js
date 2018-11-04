"use strict";
/* Imports usados */
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const BUCKET_NAME = "ia-photos-analyzer";

/* AWS Credentials */
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: ""
});

class Aws {
  /**
   *
   * @param {*} bucketKey
   * @param {*} body
   */
  static async putObjectAsync(bucketKey, body) {
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Bucket: BUCKET_NAME,
          Key: bucketKey,
          Body: Buffer.from(body, "base64"),
          ContentEncoding: "base64",
          ContentType: "application/jpg",
          ACL: "public-read"
        },
        (error, res) => (error ? reject(error) : resolve(res))
      );
    });
  }
}

module.exports = Aws;
