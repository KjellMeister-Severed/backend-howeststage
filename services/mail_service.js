const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
});

function sendMail(receivers, subject, text, html) {
    await transporter.sendMail({
    from: '"Howest StageBooker" <admin@howeststagebooker.com>',
    to: receivers,
    subject: subject,
    text: text, // plain text body
    html: html, // html body
    });

    return true;
}

module.exports = { sendMail };