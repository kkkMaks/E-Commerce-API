const sgMail = require("@sendgrid/mail");
const sendTemplateHTML = require("./sendTemplateHTML");

const SENDER = "kurmax-ipt24@lll.kpi.ua";
const URL = "http://localhost:5000/api/v1";

const sendEmail = async (email, subject, text) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email, // Change to your recipient
    from: SENDER, // Change to your verified sender
    subject,
    text,
  };

  const info = await sgMail.send(msg);

  return res.status(200).json({ info });
};

const sendResetPasswordEmail = async (email, resetToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: SENDER,
    subject: "Reset your password",
    text: `Please click on the link below to reset your password: \n\n
      ${URL}/reset-password/${resetToken}`,
  };
  const info = await sgMail.send(msg);
  return info;
};

const sendVerificationEmail = async (name, email, verificationToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: SENDER,
    subject: "Verify your email",
    html: sendTemplateHTML(name, URL, verificationToken, email),
  };
  const info = await sgMail.send(msg);
  return info;
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
