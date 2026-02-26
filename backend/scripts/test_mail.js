import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "NOT SET");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify()
    .then(() => {
        console.log('SMTP Configured successfully!');

        return transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // send to self to test
            subject: 'Test Email from Pantry Manager',
            html: '<p>This is a test email!</p>'
        });
    })
    .then(info => {
        console.log('Test email sent successfully!', info.response);
    })
    .catch(console.error);
