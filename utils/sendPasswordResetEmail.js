const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const transporter = nodemailer.createTransport({
    service: 'hotmail', // Use 'hotmail' for Outlook accounts
    auth: {
        user: process.env.EMAIL_USER, // Use the email from .env file
        pass: process.env.EMAIL_PASS  // Use the app password from .env file
    },
    tls: {
        rejectUnauthorized: false // Accept self-signed certificates
    }
});

const sendPasswordResetEmail = (to, token) => {
    const resetLink = `https://expenses-trackerrr-application.onrender.com/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendPasswordResetEmail;