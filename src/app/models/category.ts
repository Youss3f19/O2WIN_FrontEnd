export class Category {
    constructor(
        public _id: string,
        public name: string,
        public description?: string,
        public createdAt?: Date,
        public updatedAt?: Date
      ) {}
}
