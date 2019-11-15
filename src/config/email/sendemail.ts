import nodemailer = require("nodemailer");
import { Email } from "./model/email.model";
import { Message } from "./model/message.model";

const email = new Email("testeplusoft14@gmail.com", "igaindaexiste?");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email.user,
    pass: email.pass
  },
  tls: {
    rejectUnauthorized: false
  }
});

const message = new Message(
  "elonmusk@tesla.com",
  "mhbassomacedo@gmail.com",
  "Design Your Model S | Tesla",
  "Have the most fun you can in a car. Get your Tesla today!"
);

transport.sendEmail(message, (error, info) => {
  console.log("aaa");

  if (error) {
    console.log(error);
  }

  console.log(info);
});
