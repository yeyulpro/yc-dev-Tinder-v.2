// snippet-start:[ses.JavaScript.email.sendEmailV3]
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

const createSendEmailCommand = (toAddress, fromAddress, body) => {

  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Someone from yc-Tinder is interested in you. Please check it out~ ",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "YC-tinder notification",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });

};

export const run = async (body) => {
  const toAddress = "yeyulchoi2@gmail.com";          // // temporary; test/sandbox use /subject to chagne for production 
  const fromAddress = "yeyulchoi@yctinder.online";
  const sendEmailCommand = createSendEmailCommand(
    toAddress, fromAddress,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
