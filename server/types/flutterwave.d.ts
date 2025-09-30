declare module 'flutterwave-node-v3' {
  export default class Flutterwave {
    constructor(publicKey: string, secretKey: string);
    MobileMoney: {
      franco_phone(payload: any): Promise<any>;
    };
    Charge: {
      card(payload: any): Promise<any>;
    };
  }
}