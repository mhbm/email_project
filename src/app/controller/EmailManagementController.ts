import { Request, Response } from "express";
import { Database } from "../../config/database/database";
import { TaskReadMail } from "../job/taskReadMail";
import { CryptData } from "./CryptData"

class EmailManagementController {

    public async insertMailConfig(req: Request, res: Response) {
        const body = req.body

        let db = new Database();

        let mailConfig = await TaskReadMail.getMailConfigurationByEmail(
            body.email
        );

        if (mailConfig != null) {
            console.log(`O email ${body.email} informado já existe no banco`)
            res.status(401).json({ message: `O email ${body.email} informado já existe no banco` })
        } else {
            console.log(`O email ${body.email} não tem no banco`)
            let cryptData = new CryptData()

            try {
                let row = await db.insertMailConfig(
                    body.email,
                    cryptData.encryptData(body.password),
                    body.office365 ? 'OFFICE365' : null
                )
                res.status(201).send({ message: "O email foi inserido", rows: row })
            } catch (e) {
                console.log(e)
                res.status(401).json(e)
            }


        }

    }

    public async updateMailConfig(req: Request, res: Response) {
        const body = req.body

        let db = new Database();

        let mailConfig = await TaskReadMail.getMailConfigurationByEmail(
            body.email
        );

        if (mailConfig != null) {
            console.log(`O email ${body.email} informado já existe no banco`)

            let cryptData = new CryptData()

            try {
                let row = await db.updateMailConfig(
                    body.email,
                    cryptData.encryptData(body.password),
                    body.office365 ? 'OFFICE365' : null,
                    mailConfig.email_config_id
                )
                res.status(201).send({ message: "O email foi atualizado", rows: row })
                console.log("Email atualizado", row)
            } catch (e) {
                console.log(e)
                res.status(401).json(e)
            }

        } else {
            console.log(`O email ${body.email} não tem no banco`)
            res.status(401).json({ message: `O email ${body.email} não tem no banco` })
        }

    }

    public async deleteMailConfig(req: Request, res: Response) {
        const body = req.body

        let db = new Database();

        let mailConfig = await TaskReadMail.getMailConfigurationByEmail(
            body.email
        );

        if (mailConfig != null) {
            console.log(`O email ${body.email} informado já existe no banco`)

            try {
                let row = await db.deleteMailConfig(
                    mailConfig.email_config_id
                )
                res.status(201).send({ message: "O email foi excluido", rows: row })
                console.log("Email atualizado", row)
            } catch (e) {
                console.log(e)
                res.status(401).json(e)
            }

        } else {
            console.log(`O email ${body.email} não tem no banco`)
            res.status(401).json({ message: `O email ${body.email} não tem no banco` })
        }

    }

}

export default new EmailManagementController();