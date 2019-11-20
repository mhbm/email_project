import { Request, Response } from "express";

import nodemailer = require("nodemailer");

import { Email } from "../../config/email/model/email.model";
import { Message } from "../../config/email/model/message.model";

import Imap = require("imap");
import { imapConfig } from "./imapConfig";

class EmailController {
  public sendMail(req: Request, res: Response) {
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
        return res.status(401).json(error);
      }
      return res.status(200).json(info);
    });
  }

  public readMailBox(req: Request, res: Response) {
    let configuration = new imapConfig();
    console.log("Connecting to %s", configuration.host);
    let imapServer = new Imap({
      user: configuration.user,
      password: configuration.password,
      host: configuration.host,
      port: configuration.port,
      tls: configuration.tls,
      tlsOptions: { rejectUnauthorized: false } //,
      //debug: console.log
    });

    imapServer.connect();

    imapServer.once("ready", function() {
      console.log("Server status: %s", imapServer.state);
      imapServer.openBox("INBOX", true, function(err, box) {
        if (err) throw err;
        let f = imapServer.seq.fetch(box.messages.total + ":*", {
          bodies: ["TEXT", "HEADER.FIELDS (FROM TO SUBJECT DATE)"],
          struct: true
        });
        f.on("message", function(msg, seqno) {
          console.log("Message #%d", seqno);
          var prefix = "(#" + seqno + ") ";
          msg.on("body", function(stream, info) {
            var buffer = "",
              count = 0;
            stream.on("data", function(chunk) {
              count += chunk.length;
              buffer += chunk.toString("utf8");
              console.log("N2º =>", buffer, count);
            });
            stream.once("end", function() {
              /*
              console.log(
                prefix + "Parsed header: %s",
                Imap.parseHeader(buffer)
              );
              */
            });
          });
          f.once("error", function(err) {
            console.log("Fetch error: " + err);
          });
          f.once("end", function() {
            console.log("Done fetching all messages!");
            imapServer.end();
          });
        });
      });
      res.status(200).json("OK");
    });
    imapServer.once("error", function(err) {
      console.log("Connection error: aaaaa" + err.stack);
      return res.status(401).json(err);
    });
  }
}

export default new EmailController();
