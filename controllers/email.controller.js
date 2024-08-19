import nodemailer from "nodemailer";

const Subscribe = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: 'danial.rau29@ethereal.email',
        pass: 'nJ3PV4NqjYTjDFjt4Y'
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    const info = await transporter.sendMail({
      from: 'squirrelstash.com <no-reply@squirrelstash.com>', // sender address
      to: "shahzaibkhan.4659@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    res.json({ message: "email sent successfully", info });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
}

export { Subscribe };
