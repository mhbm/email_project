import { CronJob } from 'cron'
import EmailController from "../controller/EmailController";

export class TaskReadMail {

    constructor(
        public mail: string,
        public password: string,
        public office365: boolean
    ) { }

    readMail() {

        ///Executar 5 segundos
        const job = new CronJob('*/10 * * * * *', () => {
            EmailController.readMailBoxJob(this.mail, this.password, this.office365)
        })

        job.start()

    }

}