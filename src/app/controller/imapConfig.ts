import Imap = require("imap");

export class imapConfig {
  host: string;
  port: number;
  tls: boolean;

  constructor(public user: string, public password: string) {}

  configurationGmail() {
    this.host = "imap.gmail.com";
    this.port = 993;
    this.tls = true;
  }

  configurationOffice365() {
    this.host = "outlook.office365.com";
    this.port = 993;
    this.tls = true;
  }

  createImap() {
    return new Imap({
      user: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      tls: this.tls,
      tlsOptions: { rejectUnauthorized: false } //,
      //debug: console.log
    });
  }
}
