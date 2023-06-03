const sgMail = require("@sendgrid/mail");
const sendTemplateHTML = require("./sendTemplateHTML");
const BASE_URL = "http://localhost:5000/api/v1";
const SENDER = "kurmax-ipt24@lll.kpi.ua";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (name, email, subject, text) => {
  const mainText = text;

  const msg = {
    to: email, // Change to your recipient
    from: SENDER, // Change to your verified sender
    subject,
    html: sendTemplateHTML(name, mainText),
  };

  const info = await sgMail.send(msg);

  return info;
};

const sendResetPasswordEmail = async (name, email, resetToken) => {
  const mainText = "Please click on the link below to reset your password:";
  const url = `${BASE_URL}/auth/reset-password?resetToken=${resetToken}&email=${email}`;
  const btnText = "Reset Password";

  const msg = {
    to: email,
    from: SENDER,
    subject: "Reset your password",
    html: sendTemplateHTML(name, mainText, url, btnText),
  };
  const info = await sgMail.send(msg);
  return info;
};

const sendVerificationEmail = async (name, email, verificationToken) => {
  const mainText = "Please click on the button below to verify your email:";
  const url = `${BASE_URL}/auth/verify-email?verificationToken=${verificationToken}&email=${email}`;
  const btnText = "Verify Email";
  const msg = {
    to: email,
    from: SENDER,
    subject: "Verify your email",
    html: sendTemplateHTML(name, mainText, url, btnText),
  };
  const info = await sgMail.send(msg);
  return info;
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
