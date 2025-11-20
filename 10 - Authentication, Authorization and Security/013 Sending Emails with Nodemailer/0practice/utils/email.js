// THIS IS FOR THIS LECTURE
//1) We start by installing Nodemailer by doing "npm i nodemailer" which we will use to
// send email in aur application
const nodemailer = require('nodemailer');

//2) Create a sendEmail Utility Function: This function sends emails using a mail service.
const sendEmail = async (options) => {
  //a) Create a Transporter: A transporter is the service that sends the email (not Node.js directly).
  // Gmail can be used, but not recommended for production due to: Daily limits (500 emails/day)
  // High chance of getting flagged as spam
  // Better production services: SendGrid, Mailgun. For development, we use Mailtrap, which catches emails in a dev inbox.
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

  // b) Define Email Options: Specify sender, recipient, subject, message, etc.
  const mailOptions = {
    from: 'Temple Eseigbe <hello@temple.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // c) Send the Email
  await transporter.sendMail(mailOptions); // This will return a promise and so we will then use await
};

module.exports = sendEmail;
// we will use this in the authController

// Ends here