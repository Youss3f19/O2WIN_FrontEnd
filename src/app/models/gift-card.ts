import { User } from "./user";

export class GiftCard {
    constructor(
        public _id: string,
        public code : string,
        public value: number,
        public redeemed: boolean = false,
        public expirationDate : Date,
        public redeemedBy?:User


    ) { }
}
