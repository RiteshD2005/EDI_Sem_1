import nodemailer from "nodemailer";

export const sendStatusMail = async (receiver, action ,RequestId) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,   // e.g. smtp.office365.com
    port: process.env.SMTP_PORT,   // usually 587
    secure: false,                  // false for port 587
    auth: {
      user: process.env.MAIL_USER, // your vit.edu email
      pass: process.env.MAIL_PASS, // your password or app password
    },
  });

  const htmlTemplate = `
    <h3>Booking Update</h3>
    <h4>Booking Id:</h4><p>${RequestId}</p>
    <p>Your booking has been <strong>${action}</strong>.</p>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: receiver,
    subject: `Booking ${action}`,
    html: htmlTemplate,
  });
};
