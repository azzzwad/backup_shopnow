export class Category {
  id: string;
  categoryLogo: string;
  categoryName: string;

  postedOn: number;
  constructor(
    id: string,
    categoryLogo: string,
    categoryName: string,

    postedOn: number
  ) {
    this.id = id;
    this.categoryLogo = categoryLogo;
    this.categoryName = categoryName;

    this.postedOn = postedOn;
  }
}
