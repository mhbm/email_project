import { Request, Response } from "express";

import nodemailer = require("nodemailer");

import { Email } from "../../config/email/model/email.model";
import { Message } from "../../config/email/model/message.model";

import Imap = require("imap");
import { imapConfig } from "./imapConfig";
import { MailParser } from "mailparser";
import BlueBird = require("bluebird");

import { Database } from "../../config/database/database";

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

    let databaseTeste = new Database()

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

    //Promisifying IMAP
    BlueBird.promisifyAll(imapServer);
    imapServer.once("ready", () => {
      // open Inbox
      imapServer
        .openBoxAsync("INBOX", true)
        .then(box => {
          // creating new promise for processing the messages
          return new BlueBird((resolve, reject) => {
            let messages = [];
            // fetching messages
            let f = imapServer.seq.fetch(
              box.messages.total - 5 + ":" + box.messages.total,
              {
                bodies: [""]
              }
            );
            f.on("message", (msg, seqno) => {
              let message = {
                sequenceNumber: seqno,
                headers: null,
                data: []
              };
              let mp = new MailParser();
              mp.on("headers", headers => {
                message.headers = headers;
              }).on("data", obj => {
                message.data.push(obj);
              });
              msg
                .on("body", (stream, info) => {
                  stream.pipe(mp);
                })
                .on("end", () => {
                  messages.push(message);
                });
            }).on("end", function () {
              resolve(messages);
            });
          });
        })
        .each(async message => {
          //Here you have final form of message
          //console.log("@@@@@\n", message);
          //console.log(message.data.length > 0 ? message.data[0].text : "nada");

          if (message.data.length > 0) {


            try {
             const rows = await databaseTeste.checkExistEmail(
              
              message.headers.get('date'),
              message.headers.get('subject')
              //message.sequenceNumber,
              //message.headers.get('subject'),
              //'testeplusoft14@gmail.com',
              //message.data[0].textAsHtml,
            )
            if (rows.length > 0) {
              console.log("Encontrado no banco")

            } else {
              console.log("Não encontrado no banco")

              try {
                
                const rowsInsert = await databaseTeste.insertEmail(
                  message.sequenceNumber,
                  message.headers.get('subject'),
                  'testeplusoft14@gmail.com', //chumbado
                  message.data[0].textAsHtml,
                  message.headers.get('from').text,
                  message.headers.get('date')
                )
                console.log("Inserido", rowsInsert)
                } catch (e) {
  
                }
            }
           
             } catch (error) {
              //console.log("Erro na consulta : \n Code : %s \n Message : %s", error.code, error.sqlMessage)
             }


          }

        })
        .then(() => {
          imapServer.end();
          res.send("ok");
        })
        .catch(err => {
          console.log("A error has occured: ", err);
        });
    });
    imapServer.once("error", err => {
      console.log("A error has occured: ", err);
    });
    imapServer.once("end", () => {
      console.log("Connection ended");
    });
    imapServer.connect();
  }
}

export default new EmailController();
