import express = require("express");

import EmailController from "../app/controller/emailController";

import {TaskReadMail} from '../app/job/taskReadMail'


class App {
  public express: express.Application;

  emailController = EmailController;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json());
    let taskReadMail = new TaskReadMail('helpper@controlejundiai.com.br', 'H3lpper@2019', true)
    taskReadMail.readMail()
  }

  private routes(): void {
    this.express.get("/", this.emailController.sendMail);
    this.express.get("/read", this.emailController.readMailBox);
  }
}
export default new App().express;
