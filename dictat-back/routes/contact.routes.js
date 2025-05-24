const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const contactRoute = express.Router();

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'dictat@dictat.io',
        pass: 'Hmpetleva.97'
    }
});

contactRoute.route('/').post((req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: `"${name}" <dictat@dictat.io>`,
        to: "dictat@dictat.io",
        subject: subject,
        html: `<h3>Contact Details</h3><ul><li>Name: ${name}</li><li>Email: ${email}</li></ul><h3>Message</h3><p>${message}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            return res.status(500).json({ message: "Failed to send email" });
        }
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ message: "Email sent successfully" });
    });
});

module.exports = contactRoute;