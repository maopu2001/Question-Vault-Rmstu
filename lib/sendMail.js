import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = (receiver, subject, link, code) => {
  const mailOptions = {
    from: `"Question Vault - RMSTU" <${process.env.MAIL_USER}>`,
    to: receiver,
    subject,
    text: 'Verification mail',
    html: `<html><body>
  <div style="text-align: center; font-size: 1.125rem;">
    <h1>Question Vault RMSTU</h1>
    <p>
      This is a automated mail from the Question Vault RMSTU application to verify you email. Please click on the
      link and copy the code below to verify your email address:
    </p>
    <a href="${link}" target="_blank" style="background-color:#334155;
    color: white;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;">
      Verify Email
    </a>
    <p> Your 6 digit Verification Code is:</p>
    <code style="font-family: monospace;
    font-size: 2rem;
    background-color: #c5c7ca;
    padding: 0.5rem 2rem;
    width: fit-content;
    border-radius: 0.5rem;
    margin:auto">
      ${code}
  </code>
    <p>Ignore this mail if it's not you. Thank You</p>
  </div>
</body>
</html>`,
  };

  transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log('Verification Mail sent successfully');
    })
    .catch((err) => {
      console.error('Failed to send Verification Mail', err);
      throw err;
    });
};

export default sendMail;
