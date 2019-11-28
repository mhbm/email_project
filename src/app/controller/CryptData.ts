import Cryptr = require("cryptr");

export class CryptData {
    private key: string = 'helpper'

    public encryptData(information: string): string {
        const crypt = new Cryptr(this.key)
        return crypt.encrypt(information)
    }

}