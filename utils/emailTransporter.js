const nodemailer = require("nodemailer");
const pass = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'mcdicktop@gmail.com',
        pass: pass
    }
})


async function sentEmail(from, to, subject, html) {
    const info = await transporter.sendMail({
        from: `'OOO studio' ${from}`,
        to,
        subject,
        html
    })

    return { info };
}

module.exports = sentEmail;