import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD,
    }
}
 
const transport = nodemailer.createTransport(nodemailerConfig);

 const sendEmail = async(data) => {
    const email = {...data, from: UKR_NET_EMAIL};
    await transport.sendMail(email);
}

// const email = {
//     from: UKR_NET_EMAIL,
//     to: "cimim30191@vreaa.com",
//     subject: "Test email",
//     html: "<strong>Test email</strong>"
// };

// transport.sendMail(email)
//     .then(() => console.log("Verification email sent"))
//     .catch(error => console.log("Verification has already been passed"))

export default sendEmail;