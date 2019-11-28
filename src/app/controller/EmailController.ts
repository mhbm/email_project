import { Request, Response } from "express";

import nodemailer = require("nodemailer");

import { Email } from "../../config/email/model/email.model";
import { Message } from "../../config/email/model/message.model";

import Imap = require("imap");
import { imapConfig } from "./imapConfig";
import { MailParser } from "mailparser";
import BlueBird = require("bluebird");

import { Database } from "../../config/database/database";
import { TaskReadMail } from "../job/taskReadMail";
import { CronJob } from "cron";

import ExpressValidator = require('express-validator');
import emojiStrip = require('emoji-strip')

class EmailController {

  /**
   * sendMail
   *
   * Responsável por enviar o email
   * O padrão do request é :
   *      {
   *      "configEmail": {
   *            "email": string,
   *            "password": string, 
   *         }
   *      "configMessage": {
   *          "from": "email do remetente",
   *          "to": "email destinatario",
   *          "subject": "assunto do email",
   *          "text": "Body do email"
   *      }
   *
   * @public
   * @author Mateus Macedo
   * @param  {express.Request} req the express request object
   * @param  {express.Response} res the express response object
   * @return {void}
   */

  public sendMail(req: Request, res: Response) {

    //Verificação para ver se tem erro no request
    const errors = ExpressValidator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

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

    //Criando o transport com o valor HOTMAIL "chumbado"
    let transportEmail = nodemailer.createTransport({
      service: "Hotmail", //https://nodemailer.com/smtp/well-known/
      auth: {
        user: email.user,
        pass: email.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    //Enviando o Email
    transportEmail.sendMail(message.messageJSON(), (error, info) => {
      if (error) {
        console.log("Erro ao enviar a mensagem", error);
        return res.status(401).json(error);
      }
      return res.status(200).json(info);
    });
  }

  /**
   * readMailBox
   *
   * Responsável por ler a caixa de entrada do email/senha passado no request
   * O padrão do request é :
   *      {
   *      "configEmail": {
   *             "email": string,
   *            "password": string,
   *             "office365" : boolean    ///verificador de é office365 ou não. Tem essa verificação para pegar a configuração
   *         }
   *      }
   *
   * @public
   * @author Mateus Macedo
   * @param  {express.Request} req the express request object
   * @param  {express.Response} res the express response object
   * @return {void}
   */

  public readMailBox(req: Request, res: Response) {
    const body = req.body;

    let errorReturn = {};

    let db = new Database();

    let configuration = new imapConfig(
      body.configEmail.email,
      body.configEmail.password
    );

    if (body.configEmail.office365 === true) {
      configuration.configurationOffice365();
    } else {
      configuration.configurationGmail();
    }

    const imapServer = configuration.createImap();

    //Promisifying IMAP
    BlueBird.promisifyAll(imapServer);
    imapServer.once("ready", () => {
      // open Inbox
      imapServer
        .openBoxAsync("INBOX", true) ///PEGANDO A CAIXA DE ENTRADA
        .then(box => {
          // creating new promise for processing the messages
          return new BlueBird((resolve, reject) => {
            let messages = [];
            // fetching messages

            //Verificação da quantidade de email
            let checkNumberEmail = box.messages.total - 5;

            if (checkNumberEmail <= 0) {
              checkNumberEmail = 1;
            }

            //Fazendo o fetch dos emails (pegando os ultimos 5 inseridos)
            let f = imapServer.seq.fetch(
              checkNumberEmail + ":" + box.messages.total,
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

              //utilizando a lib MailParser para ler as informações do email
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
          if (message.data.length > 0) {
            try {
              const rows = await db.checkExistEmail(
                message.headers.get("date"),
                message.headers.get("subject")
              );

              if (rows.length > 0) {
                console.log("Encontrado no banco");
              } else {
                console.log("Não encontrado no banco");

                try {
                  const rowsInsert = await db.insertEmail(
                    message.sequenceNumber,
                    message.headers.get("subject"),
                    body.configEmail.email,
                    message.data[0].textAsHtml,
                    message.headers.get("from").text,
                    message.headers.get("date"),
                    message.headers.get('message-id'),
                    message.headers.get('in-reply-to')
                  );
                  console.log("Inserido", rowsInsert);
                } catch (e) {
                  throw e;
                }
              }
            } catch (error) {
              console.log(
                "Erro na consulta : \n Code : %s \n Message : %s",
                error.code,
                error.sqlMessage
              );
              throw error;
            }
          }
        })
        .then(() => {
          console.log("Finalizado");
          imapServer.end();
        })
        .catch(err => {
          console.log("A error has occured: ", err);

          //res.status(401).json(err)
        });
    });
    imapServer.once("error", err => {
      console.log("A error has occured:", err);
      errorReturn = err;

      //res.status(401).json(err)
    });
    imapServer.once("close", () => {
      console.log("Connection ended");

      if (Object.keys(errorReturn).length > 0) {
        res.status(401).json(errorReturn);
      } else {
        res.status(201).json({
          message: `A leitura do email ${body.configEmail.email} aconteceu com sucesso`
        });
      }
    });

    imapServer.connect();
  }

  public static async readMailBoxJob(
    email: string,
    password: string,
    office365: boolean
  ) {
    return new Promise((resolve, reject) => {
      let errorsReturn = {};

      let db = new Database();

      let configuration = new imapConfig(email, password);

      if (office365 === true) {
        configuration.configurationOffice365();
      } else {
        configuration.configurationGmail();
      }

      const imapServer = configuration.createImap();

      //Promisifying IMAP
      BlueBird.promisifyAll(imapServer);

      imapServer.once("ready", () => {
        // open Inbox
        imapServer
          .openBoxAsync("INBOX", true) ///PEGANDO A CAIXA DE ENTRADA
          .then(box => {
            // creating new promise for processing the messages
            return new BlueBird((resolve, reject) => {
              let messages = [];
              // fetching messages

              //Verificação da quantidade de email
              let checkNumberEmail = box.messages.total - 5;

              if (checkNumberEmail <= 0) {
                checkNumberEmail = 1;
              }

              //Fazendo o fetch dos emails (pegando os ultimos 5 inseridos)
              let f = imapServer.seq.fetch(
                checkNumberEmail + ":" + box.messages.total,
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

                //utilizando a lib MailParser para ler as informações do email
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
            if (message.data.length > 0) {
              try {

                let ds_subject = message.headers.get("subject")
                //Removendo aspas e apóstrofe
                ds_subject = ds_subject.replace(/["|']/g, ' ')
                //Removendo emoticon
                ds_subject = emojiStrip(ds_subject)
                const rows = await db.checkExistEmail(
                  message.headers.get("date"),
                  ds_subject
                );

                if (rows.length > 0) {
                  console.log("Encontrado no banco");
                } else {
                  console.log("Não encontrado no banco");

                  try {
                    const rowsInsert = await db.insertEmail(
                      message.sequenceNumber,
                      ds_subject,
                      email,
                      message.data[0].textAsHtml,
                      message.headers.get("from").text,
                      message.headers.get("date"),
                      message.headers.get('message-id'),
                      message.headers.get('in-reply-to')
                    );
                    console.log("Inserido", rowsInsert);
                  } catch (e) {
                    throw e;
                  }
                }
              } catch (error) {
                console.log(
                  "Erro na consulta : \n Code : %s \n Message : %s",
                  error.code,
                  error.sqlMessage
                );
                throw error;
              }
            }
          })
          .then(() => {
            console.log("finalizado");
            imapServer.end();
          })
          .catch(err => {
            console.log("A error has occured: ", err);
            reject(err);
          });
      });

      imapServer.once("error", err => {
        console.log("A error has occured: ", err);
        reject(err);
      });

      imapServer.once("close", () => {
        console.log("Connection ended");
        resolve();
      });

      imapServer.connect();
    });
  }

  public async jobMailBox(req, res) {
    const body = req.body;

    let mailConfiguration = await TaskReadMail.getMailConfigurationByEmail(
      body.email
    );

    if (mailConfiguration != null) {
      const job = new CronJob("*/15 * * * * *", () => {
        EmailController.readMailBoxJob(
          mailConfiguration.email,
          mailConfiguration.password,
          mailConfiguration.office365
        )
          .then(info => {
            //res.status(201).json("ok");
            //res.redirect("/readJob");
          })
          .catch(e => {
            console.log(e.message);
            res.status(401).json(e.message);
            job.stop();
          });
      });
      job.start();
    } else {
      res.status(401).json({
        message: `O email ${body.email} não tem no banco de dados`
      });
    }
  }
}

export default new EmailController();
