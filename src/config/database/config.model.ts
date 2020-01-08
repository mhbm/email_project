import * as mysql from "mysql2";

export class ConfigDatabase {
  constructor(
    public host: string,
    public user: string,
    public password: string,
    public database: string
  ) {}

  public createConnection() {
    return mysql.createPool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
}

//Configuração do banco mysql

export const database = {
  development: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "email_project"
  },
  production: {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "testEmail"
  }
};
