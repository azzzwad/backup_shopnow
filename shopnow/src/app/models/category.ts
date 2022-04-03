export class Category {
  id: string;
  categoryLogo: string;
  categoryName: string;

  postedOn: string;
  constructor(
    id: string,
    categoryLogo: string,
    categoryName: string,

    postedOn: string
  ) {
    this.id = id;
    this.categoryLogo = categoryLogo;
    this.categoryName = categoryName;

    this.postedOn = postedOn;
  }
}
