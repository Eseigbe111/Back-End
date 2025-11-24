const nodemailer = require('nodemailer');

//  Fc for sending emails
const sendEmail = async (options) => {
  // In order to send email with nodemailer, we do the below
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    // The auth ppt is basically for authenticatn
    auth: {
      //These will be saved in the config file as we've don so far
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Define the email optns
  const mailOptions = {
    // Here we specify where the email is coming from,
    from: 'Jonas Schmedtmann <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  //3) Actually send the email with nodemailer
  await transporter.sendMail(mailOptions); // This will return a promise and so we will then use asyncawait
};

module.exports = sendEmail;
