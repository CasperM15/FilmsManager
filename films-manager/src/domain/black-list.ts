class Blacklist {
    static instance: Blacklist;
    tokenList!: string[];
    
    constructor() {
      if (!Blacklist.instance) {
        this.tokenList = [];
        Blacklist.instance = this;
      }
      return Blacklist.instance;
    }
  
    addToken(token: string) {
      this.tokenList.push(token);
    }
  
    isTokenRevoked(token: string) {
      return this.tokenList.includes(token);
    }
  }

  module.exports = Blacklist;