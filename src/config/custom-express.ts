import express = require("express");

import EmailController from "../app/controller/emailController";

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
  }

  private routes(): void {
    this.express.get("/", this.emailController.sendMail);
    this.express.get("/read", this.emailController.readMailBox);
  }
}
export default new App().express;
