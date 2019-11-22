import express = require("express");

import EmailController from "../app/controller/emailController";

import {TaskReadMail} from '../app/job/taskReadMail'

import {CronJob} from 'cron'

import * as CryptoJS from 'crypto-js'


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
    let mailConfiguration = await TaskReadMail.getMailConfigurationById(2)
    
    var hash = CryptoJS.SHA512("Message"); 

    console.log(hash)
    return null


    if (mailConfiguration != null) {
      const job = new CronJob('*/5 * * * * *', () => {
        console.log("kkkk", mailConfiguration.password)
        console.log(CryptoJS.AES.decrypt(mailConfiguration.password, 'helpper').toString())
        this.emailController.readMailBoxJob(mailConfiguration.email, CryptoJS.AES.decrypt(mailConfiguration.password, 'helpper').toString(), mailConfiguration.office365)
      })
      
      job.start()
    }
  }

  private routes(): void {
    this.express.get("/", this.emailController.sendMail);
    this.express.get("/read", this.emailController.readMailBox);
  }
}
export default new App().express;
