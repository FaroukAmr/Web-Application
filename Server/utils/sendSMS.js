import Vonage from '@vonage/server-sdk';

const sendSMS = (options) => {
  const vonage = new Vonage(
    {
      apiKey: '6f3c5147',
      apiSecret: 'HJCNh4IrLiIu2zZO',
    },
    { debug: false }
  );

  vonage.message.sendSms(
    options.from,
    options.to,
    options.message,
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]['status'] === '0') {
          console.log('Message sent successfully.');
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]['error-text']}`
          );
        }
      }
    }
  );
};

export default sendSMS;
