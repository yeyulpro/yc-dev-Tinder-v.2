// snippet-start:[ses.JavaScript.email.sendEmailV3]
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

 const createSendEmailCommand = (toAddress, fromAddress) => {
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
          Data: "<h1>This is Amazon SES email test... by Yeyul </h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is Amazon SES email test... by Yeyul ",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "This is Amazon SES email test by Yeyul",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
  
};

export const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "yeyulchoi@outlook.com",
    "yeyul@ycdevpro.online",
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
