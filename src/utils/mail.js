import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Mailgen from "mailgen";

dotenv.config();

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'ZORVYN-INTERN',
            link: 'https://mailgen.js/'
        }
    });

    var emailBody = mailGenerator.generate(options.mailGenContent);
    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_TRAP_HOST,
        port: process.env.MAIL_TRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS,
        }
    });

    await transporter.sendMail({
        from: 'task@example.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: emailText, // plain text body
        html: emailBody, // html body
    });

};


const verificationMailGenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: 'Welcome to App! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with our App, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
};

const forgotPasswordMailGenContent = (username, forgotPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: 'We got a request to reset your password',
            action: {
                instructions: 'To reset your password, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset your password',
                    link: forgotPasswordUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
};

const resetPasswordMailGenContent = (username) => {
    return {
        body: {
            name: username,
            intro: 'Welcome to App! We\'re very excited to have you on board.',
            action: {
                instructions: 'Your password got reset successfully as on your request',
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}


export { sendEmail, verificationMailGenContent, forgotPasswordMailGenContent, resetPasswordMailGenContent };