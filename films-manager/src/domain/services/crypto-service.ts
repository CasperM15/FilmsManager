require('dotenv').config();

const crypto = require('crypto');

export interface  ICryptoService {
    encrypt(data: string): string;
    decrypt(data: string): string;
};

class CryptoService implements ICryptoService {

    constructor() 
    {}

    encrypt(data: string) {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.CRYPTO_KEY);
        let encrypted = cipher.update(data, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(data: string) {
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.CRYPTO_KEY);
        let decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    }
}
  
module.exports = CryptoService 