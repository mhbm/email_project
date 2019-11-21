import { ConfigDatabase, database } from "./config/database/config.model";

const config = new ConfigDatabase(database.development.host, database.development.user, database.development.password, database.development.database);

config.connection();

/*
import nodemailer = require("nodemailer");

import { Email } from "./config/email/model/email.model";
import { Message } from "./config/email/model/message.model";

const email = new Email("testeplusoft14@gmail.com", "igaindaexiste?");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email.user,
    pass: email.password
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

/*
let teste = message.transportMessage();

console.log(teste);

transport.sendMail(message.transportMessage(), (error, info) => {
  console.log("aaa");

  if (error) {
    console.log(error);
  }

  console.log(info);
});
*/
