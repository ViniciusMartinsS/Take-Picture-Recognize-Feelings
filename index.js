"use strict";
const request = require("request");
const NodeWebcam = require("node-webcam");
const { promisify } = require("util");
const captureAsync = promisify(NodeWebcam.capture);
const aws = require("./Services/aws");
const fs = require("fs");

function azure(url) {
  // Replace <Subscription Key> with your valid subscription key.
  const subscriptionKey = "";

  // You must use the same location in your REST call as you used to get your
  // subscription keys. For example, if you got your subscription keys from
  // westus, replace "westcentralus" in the URL below with "westus".
  const uriBase =
    "https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect";

  const imageUrl = url;

  // Request parameters.
  const params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes:
      "age,gender,headPose,smile,facialHair,glasses," +
      "emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
  };

  const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
    console.log("JSON Response\n");
    console.log(jsonResponse);
  });
}

const opts = {
  callbackReturn: "base64",
  quality: 100
};
(async () => {
  await captureAsync("foto", opts);
  const base64 = fs.readFileSync("./foto.jpg", "base64");
  const responseBucket = await aws.putObjectAsync("foto.jpg", base64);
  console.log("Resposta Bucket: ", responseBucket);
  if (responseBucket)
    azure("https://s3.amazonaws.com/ia-photos-analyzer/foto.jpg");
})();
