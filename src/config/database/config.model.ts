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

  connection() {
    const con = this.createConnection();
    con.connect((error: any) => {
      if (error) {
        console.log(
          "Erro na conexão com o banco de dados : \n Code : %s \n Message: %s ",
          error.code,
          error.sqlMessage
        );
      } else {
        con.query("SELECT 1 + 1 AS solution", function(error, results, fields) {
          if (error) throw error;
          console.log("The solution is: ", results[0].solution);
        });
        con.end();
      }
    });
  }
}

//Configuração do banco mysql

export const database = {
  development: {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "email_project"
  },
  production: {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "testEmail"
  }
};
