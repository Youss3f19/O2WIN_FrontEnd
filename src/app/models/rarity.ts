export class Rarity {
    probability: any;
    constructor(
        public _id: string,
        public name: string,
        public order: number,
        public createdAt?: Date,
        public updatedAt?: Date
      ) {}

}
