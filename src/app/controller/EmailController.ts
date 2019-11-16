import { Request, Response } from "express";

import nodemailer = require("nodemailer");

import { Email } from "../../config/email/model/email.model";
import { Message } from "../../config/email/model/message.model";

class EmailController {
  public create(req: Request, res: Response) {
    const body = req.body;

    //Passando os parametros para a criação do email
    const email = new Email(body.configEmail.email, body.configEmail.password);

    //Passando os parametros para a criação da mensagem a ser enviada
    const message = new Message(
      body.configMessage.from,
      body.configMessage.to,
      body.configMessage.subject,
      body.configMessage.text
    );

    let transportEmail = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: email.user,
        pass: email.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log(message.messageJSON());

    transportEmail.sendMail(message.messageJSON(), (error, info) => {
      if (error) {
        console.log("Erro ao enviar a mensagem", error);
        res.status(401).json(error);
      }
      res.status(200).json(info);
    });
  }
}

export default new EmailController();
