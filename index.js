"use strict";
const request = require("request");
const NodeWebcam = require("node-webcam");
const { promisify } = require("util");
const captureAsync = promisify(NodeWebcam.capture);

function azure() {
  /* Adicione aqui sua subscription Key */
  const subscriptionKey = "<subscriptionKey>";

  const uriBase =
    "https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect";

  const imageUrl = "./foto.jpg";

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
  azure();
})();