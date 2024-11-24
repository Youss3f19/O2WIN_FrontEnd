import { User } from "./user";

export class Comment {
    constructor(
        public _id: string,
        public content: string,
        public boxId: string,
        public user : User,
        public createdAt?: Date,
        public updatedAt?: Date,
    ){}
}
