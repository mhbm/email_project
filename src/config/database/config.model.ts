import * as mysql from "mysql";

export class Config {
  constructor(
    public host: string,
    public user: string,
    public password: string
  ) {}

  private __createConnection() {
    return mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password
    });
  }

  conection() {
    const con = this.__createConnection();

    con.connect((error: any) => {
      if (error) {
        console.log("Erro na conexão com o banco de dados : ", error);
        throw error;
      }
      console.log("Conectado");
    });
  }
}
