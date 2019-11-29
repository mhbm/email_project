import EmailController from "../app/controller/emailController";
import { EmailValidation } from "../app/validation/EmailValidation";
import { Express } from "express";
import { CryptData } from '../app/controller/CryptData'

import EmailManagementController from "../app/controller/EmailManagementController"

export class Routers {
  emailController = EmailController;
  emailManagementController = EmailManagementController;

  constructor(private express: Express) { }

  public routers() {

    this.express.get(
      "/sendMail",
      EmailValidation.sendMailValidation(),
      this.emailController.sendMail
    );

    this.express.post("/readMailBox", this.emailController.readMailBox);
    this.express.get("/readJob", this.emailController.jobMailBox);
    this.express.get("/generate", (req, res) => {
      const password = req.body.password;
      const cryptData = new CryptData()
      res.status(201).send(cryptData.encryptData(password));
    });

    this.express.route('/management/mail')
      .post(this.emailManagementController.insertMailConfig)
      .delete(this.emailManagementController.deleteMailConfig)
      .put(this.emailManagementController.updateMailConfig)

    this.express.get('/mail/historic', (req, res) => {
      console.log("Histórico do email")
      res.send("Histórico do email - Precisa desenvolver")
    })

    // Route not found
    this.express.use(function (req, res, next) {
      return res.status(404).send({ message: 'Route' + req.url + ' Not found.' });
    });
  }
}
