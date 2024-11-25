import { User } from "./user";

export class GiftCard {
    constructor(
        public _id: string,
        public code : string,
        public value: number,
        public isRedeemed: boolean = false,
        public redeemedBy?:User,
        public createdAt?: Date,



    ) { }
}
