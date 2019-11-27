import express = require("express");

import EmailController from "../app/controller/emailController";

import {Routers} from './Routes'

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
  }

  private routes(): void {

    let routers = new Routers(this.express)
    routers.routers()
    
  }
}
export default new App().express; 
