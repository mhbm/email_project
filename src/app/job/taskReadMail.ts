import { CronJob } from 'cron'
import EmailController from "../controller/EmailController";

import { Database } from "../../config/database/database";
import * as CryptoJS from 'crypto-js'



export class TaskReadMail {

    constructor(
        public mail: string,
        public password: string,
        public office365: boolean
    ) { }

    static async getMailConfigurationById(id: number) {
        let db = new Database()
        const row = await db.getMailConfigurationById(id) //parametro chumbado

        if (row.length > 0) {
            console.log('registro encontrado')
            
            return {
                email: row[0].ds_email,
                password: row[0].ds_password,
                //password: CryptoJS.SHA256(row[0].ds_password).toString(),
                office365 : row[0].flg_office365 == 'OFFICE365'
            }

        } else {
            console.log("registro nao encontrado")
            return null
        }

    }


    readMail() {

        ///Executar 5 segundos
        const job = new CronJob('*/10 * * * * *', () => {
            EmailController.readMailBoxJob(this.mail, this.password, this.office365)
        })

        job.start()

    }

}