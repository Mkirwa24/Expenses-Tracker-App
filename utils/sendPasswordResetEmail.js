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
    const resetLink = `https://expenses-tracking-application1.netlify.app/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Password Reset Request',
        text: `Hi ${user.username},
    We received a request to reset your password. You can reset your password by clicking the link below:
    
    Reset Password: ${resetLink}
    
    If you did not request this password reset, please ignore this email or contact our support team.

    For security reasons, this link will expire in 15 minutes and can only be used once.`,
        }; 


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Function to send password reset success email
const sendSuccessEmail = (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Password Has Been Reset',
        text: `Your password was successfully reset. If you didn't request this change, please contact support immediately.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending success email:', error);
        } else {
            console.log('Success email sent:', info.response);
        }
    });
};

module.exports = {sendPasswordResetEmail, sendSuccessEmail};