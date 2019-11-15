export class Message {
  constructor(
    public from: string,
    public to: string,
    public subject: string,
    public text: string
  ) {}

  transportMessage() {
    return {
      from: this.from,
      to: this.to,
      subject: this.subject,
      text: this.subject
    };
  }
}
