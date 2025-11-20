// B4 we do anything, let's install the NOdemailer package by doing "npm i nodemailer".
// This is the package we will use in sending emails in our application

const nodemailer = require('nodemailer');

// THIS IS FOR THIS LECTURE: Fc for sending emails
// In the optns we will pass in things like the email address, where we want to send the email to, the subject line, the email content
// and maybe sm other stuff
const sendEmail = async (options) => {
  // In order to send email with nodemailer, we do the below
  //1) Create a transporter
  //The transporter we need here is actually the service that will wend the email, bcos it's not node.js tht will actually send the email
  // itself. It's just a service that we define in here e.g like a gmail. Gmail is not the service we will use, but let me show u how it
  // is done with gmail bcos so many people will be interested in this:
  const transporter = nodemailer.createTransport({
    // service: 'Gmail', // We cn specify it just like this. There are a number of services that Nodemailer knows how to deal with,and so we do
    // // not have to configure this manually. Gmail is just one of the services. But there is Yahoo, or Hotmail,or many others.
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    // The auth ppt is basically for authenticatn
    auth: {
      //These will be saved in the config file as we've don so far
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    // In ur gmail app, u'll need to activate the "less secure app" optn
    // The reason we are not using gmail in this applicatn is bcos Gmail is not at all a good idea for a prodn app. Using gmail for this kind of
    // stuff, u can only send 500 emails per day and also u'll probably very quickly be marked as a spammer, and from there, it will only go
    // downhill. Unless its like a private app and u just send emails to urself, or, like, 10 friends, well, then u shoulld use another service.
    // And some well-known ones are SendGrid and Mailgun. We will use Sendgrid a bit lstter in this course

    // Right now we wre going to use a special devpt service, which basically fakes to send emails to real addresses, but in reality,these emails
    // end up trapped in a devpt inbox, so that we can take a look at how they will look later in prodn. That service is called Mailtrap and so let's
    // sign up for that. U'll go to mailtrap.io to sign up.

    // After sign up, we enter "Sandboxes" and change "My Sandbox" to "natours" and then "save". Then click on "natours", it leads to another page
    // and copy the  "Username" and "Password" and replace them with what we have in the config file in "EMAIL_USERNAME" and "EMAIL_PASSWORD" and the
    // "Port". And also put the "Host" this is bcos mailtrap is not one of the predefined services that comes from Nodemailer.
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

  console.log({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  });

  //3) Actually send the email with nodemailer
  await transporter.sendMail(mailOptions); // This will return a promise and so we will then use asyncawait
};

module.exports = sendEmail;
