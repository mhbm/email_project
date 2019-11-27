import { Router } from "express";
import EmailController from "../app/controller/emailController";
import { EmailValidation } from '../app/validation/EmailValidation'
import Cryptr = require("cryptr");
import { Express } from 'express'

export class Routers {

    emailController = EmailController

    constructor(private express: Express) {}

    public routers() {

        //this.express.get("/", this.emailController.sendMail);
        this.express.get("/", EmailValidation.sendMailValidation(), this.emailController.sendMail);

        this.express.get("/read", this.emailController.readMailBox);
        this.express.get("/readJob", this.emailController.jobMailBox);
        this.express.get('/generate', (req, res) => {
            const password = req.body.password

            const cryptr = new Cryptr('helpper');
            let encryptdPassword = cryptr.encrypt(password);
            console.log(encryptdPassword)
            res.status(201).send(encryptdPassword)

        })
        this.express.get('/jobListernerMailBox', this.emailController.jobListernerMailBox)
    }

}


