import { ConfigDatabase, database } from "../../config/database/config.model";

export class Database {

    config = new ConfigDatabase(database.development.host, database.development.user, database.development.password, database.development.database);

    connection: any

    constructor() {
        this.connection = this.config.createConnection()
    }

    //checkExistEmail(sequenceNumber: number, subject: string, email: string, bodyEmail: string) : boolean {
    async checkExistEmail(dt_email: Date, ds_subject: string) {

        let check = false;

        try {
            //console.log(date.toISOString().slice(0, 19).replace('T', ' '))

            const [rows, fields] = await this.connection.promise().query(
                'SELECT * FROM `email` where `dt_email` = ? and `ds_subject` = ?',
                //sql: 'SELECT * FROM `email` WHERE `sequenceNumber` = ? and `subject` = ? and `ds_email` = ? and `bodyEmail` = ?',
                [dt_email.toISOString().slice(0, 19).replace('T', ' '), ds_subject]
            )
            //console.log('rows => ', rows)
            return rows
        } catch (error) {

            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.code, error.sqlMessage)

            throw error
        }

    }

    async checkMessageId(ds_message_id) {
        try {
            const [rows, fields] = await this.connection.promise().query(
                'SELECT * FROM `email` where `ds_message_id` = ?',
                [ds_message_id]
            )

            return rows
        } catch (error) {
            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.code, error.sqlMessage)
            throw error
        }
    }

    async deleteMailConfig(id: number) {

        try {
            const [rows, fields] = await this.connection.promise().query(
                'DELETE FROM email_config where email_config_id = ?',
                [id]
            )
            return rows
        } catch (error) {
            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.code, error.sqlMessage)
            throw error
        }
    }

    async updateMailConfig(desc_email: string, hash_password: string, desc_provider: string, id: number) {

        try {
            const [rows, fields] = await this.connection.promise().query(
                'UPDATE email_config set desc_email = ? , hash_password = ? , desc_provider = ? where email_config_id = ?',
                [desc_email, hash_password, desc_provider, id]
            )
            return rows
        } catch (error) {
            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.code, error.sqlMessage)
            throw error
        }
    }

    async insertMailConfig(desc_email: string, hash_password: string, desc_provider: string) {

        try {   
            const [rows, fields] = await this.connection.promise().query(
                'INSERT INTO email_config(desc_email, hash_password,desc_provider) values (?,?,?)',
                [desc_email, hash_password, desc_provider]
            )
            return rows
        } catch (error) {
            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.code, error.sqlMessage)
            throw error
        }
    }

    async insertEmail(num_sequenceNumber: number, ds_subject: string, ds_email: string, ds_body: string, ds_from: string, dt_email: Date, ds_message_id: string, ds_message_id_parent: string) {

        try {

            const [rows, fields] = await this.connection.promise().query(

                'INSERT INTO email(num_sequenceNumber, ds_subject, ds_email, ds_body, ds_from, dt_email, ds_message_id, ds_message_id_parent) values (?,?,?,?,?,?, ?, ?)',
                [num_sequenceNumber, ds_subject, ds_email, ds_body, ds_from, dt_email.toISOString().slice(0, 19).replace('T', ' '), ds_message_id, ds_message_id_parent]

            )
            console.log(rows)
        } catch (error) {
            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.code, error.sqlMessage)
            throw error
        }

    }

    async getMailConfigurationById(id: number) {
        try {
            //console.log(date.toISOString().slice(0, 19).replace('T', ' '))
            const [rows, fields] = await this.connection.promise().query(
                'SELECT * FROM `email_config` where `email_config_id` = ?',
                //sql: 'SELECT * FROM `email` WHERE `sequenceNumber` = ? and `subject` = ? and `ds_email` = ? and `bodyEmail` = ?',
                [id]
            )
            //console.log('rows => ', rows)
            return rows
        } catch (error) {
            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.ode, error.sqlMessage)
            throw error
        }
    }

    async getMailConfigurationByEmail(email: string) {

        try {
            //console.log(date.toISOString().slice(0, 19).replace('T', ' '))
            const [rows, fields] = await this.connection.promise().query(
                'SELECT * FROM `email_config` where `desc_email` = ?',
                //sql: 'SELECT * FROM `email` WHERE `sequenceNumber` = ? and `subject` = ? and `ds_email` = ? and `bodyEmail` = ?',
                [email]
            )
            //console.log('rows => ', rows)
            return rows
        } catch (error) {
            console.log("Erro na consulta : \n Code : %s \n Message : %s", error.ode, error.sqlMessage)
            throw error
        }
    }

}