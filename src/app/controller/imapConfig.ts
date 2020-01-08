import Imap = require("imap");

/**
 *
 * @author Mateus Macedo
 * @since  11/2019
 */

export class imapConfig {
  host: string;
  port: number;
  tls: boolean;

  constructor(public user: string, public password: string) {}

  /*
   * Função para configurar pos valores para o Gmail
   */

  configurationGmail() {
    this.host = "imap.gmail.com";
    this.port = 993;
    this.tls = true;
  }

  /*
   * Função para configurar pos valores para o Office365
   */

  configurationOffice365() {
    this.host = "outlook.office365.com";
    this.port = 993;
    this.tls = true;
  }

  /*
   * Função para criar o IMAP configurado e retorná-lo
   */

  createImap() {
    return new Imap({
      user: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      tls: this.tls,
      tlsOptions: { rejectUnauthorized: false }, //,
      //debug: console.log
      mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib.
      attachments: true, // download attachments as they are encountered to the project directory
      attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
    });
  }
}
