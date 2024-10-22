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
    from: process.env.MAIL_USER,
    to: receiver,
    subject,
    text: 'Verification mail',
    html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <style>
    p {
      text-align: center;
      font-size: 1.125rem;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    a {
      background-color: rgb(51 65 85);
      color: white;
      padding: 0.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
    }

    .code {
      font-family: monospace;
      font-size: 2rem;
      background-color: rgb(51 65 85 / 0.2);
      padding: 1rem 2rem;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Exam Question Dump RMSTU</h1>
    <p>
      This is a automated mail from the Exam Question Dump RMSTU application to verify you email. Please click on the
      link and copy the code below to verify your email address:
    </p>
    <a href="${link}">
      Verify Email
    </a>
    <p> Your 6 digit Verification Code is:</p>
    <p class="code">
      ${code}
    </p>
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
      console.log('Failed to send Verification Mail', err);
      throw err;
    });
};

export default sendMail;
