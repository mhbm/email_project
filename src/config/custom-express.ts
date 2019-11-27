import express = require("express");

import EmailController from "../app/controller/emailController";

import { TaskReadMail } from "../app/job/taskReadMail";

import { CronJob } from "cron";

import * as CryptoJS from "crypto-js";

import Cryptr = require("cryptr");

const { check, validationResult } = require('express-validator');
import ExpressValidator = require('express-validator');

import {EmailValidation} from '../app/validation/EmailValidation'

class App {
  public express: express.Application;

  emailController = EmailController;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private async middlewares(): Promise<void> {
    this.express.use(express.json());
    //let taskReadMail = new TaskReadMail('helpper@controlejundiai.com.br', 'H3lpper@2019', true)
    //let mailConfiguration = await TaskReadMail.getMailConfigurationById(2)

    /*let mailConfiguration = await TaskReadMail.getMailConfigurationByEmail(
      "helpper@controlejundiai.com.br"
    );
    /* - teste
    const cryptr = new Cryptr('helpper');
    let password = 'H3lpper@2019';
    let encryptdPassword = cryptr.encrypt(password);
    console.log(encryptdPassword)
    console.log("Decrypted email = ", cryptr.decrypt(encryptdPassword ));
    */

    //    if (mailConfiguration != null) {
    //    const job = new CronJob("*/5 * * * * *", async () => {
    /*    this.emailController
          .readMailBoxJob(
            mailConfiguration.email,
            mailConfiguration.password + "asss",
            mailConfiguration.office365
          )
          .then()
          .catch(e => {
            console.log(e.message);
            job.stop();
          });
      });
      job.start();
    }
    */
  }

  private routes(): void {
    //this.express.get("/", this.emailController.sendMail);
    this.express.get("/", EmailValidation.sendMailValidation(),
    this.emailController.sendMail);

    this.express.get("/read", this.emailController.readMailBox);
    this.express.get("/readJob", this.emailController.jobMailBox);
  }
} 
export default new App().express; 
