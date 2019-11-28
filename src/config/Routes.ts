import EmailController from "../app/controller/emailController";
import { EmailValidation } from "../app/validation/EmailValidation";
import { Express } from "express";
import {CryptData} from '../app/controller/CryptData'

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
      const cryptData = new CryptData()

      res.status(201).send(cryptData.encryptData(password));
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
