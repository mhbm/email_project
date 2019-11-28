import EmailController from "../app/controller/emailController";
import { EmailValidation } from "../app/validation/EmailValidation";

import Cryptr = require("cryptr");
import { Express } from "express";

export class Routers {
  emailController = EmailController;

  constructor(private express: Express) { }

  public routers() {
    //this.express.get("/", this.emailController.sendMail);
    this.express.get(
      "/sendMail",
      EmailValidation.sendMailValidation(),
      this.emailController.sendMail
    );

    this.express.post("/readMailBox", this.emailController.readMailBox);
    this.express.get("/readJob", this.emailController.jobMailBox);
    this.express.get("/generate", (req, res) => {
      const password = req.body.password;

      const cryptr = new Cryptr("helpper");
      let encryptdPassword = cryptr.encrypt(password);
      console.log(encryptdPassword);
      res.status(201).send(encryptdPassword);
    });

    this.express.route('/management/mail')
      .post((req, res) => {
        res.send("INSERIR MAIL - Precisa desenvolver")
      })
      .delete((req, res) => {
        res.send("DELETAR MAIL - Precisa desenvolver")
      })
      .put((req, res) => {
        res.send("Atualizar mail - Precisa desenvoler")
      })

    this.express.get('/mail/historic', (req, res) => {
        console.log("Histórico do email")
        res.send("Histórico do email - Precisa desenvolver")
    })
  }
}
