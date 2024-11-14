import { Category } from "./category";
import { rarityProbabilities } from "./rarity-probability";

export class Box {
   
    constructor(
        public _id: string,
        public name: string,
        public price: number,
        public rarityProbabilities: rarityProbabilities[],
        public productLimit: number,
        public categories: Category[],
        public createdAt?: Date,
        public updatedAt?: Date,
        public boxImage?: string,
      ) {}
    

}
