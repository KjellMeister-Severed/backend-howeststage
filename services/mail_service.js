const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465 ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendMail(receivers, subject, text, html) {
    await transporter.sendMail({
    from: '"Howest StageBooker" <noreply@howeststageplatform.onmicrosoft.com>',
    to: receivers,
    subject: subject,
    text: text, // plain text body
    html: html, // html body
    });

    return true;
}

module.exports = { sendMail };