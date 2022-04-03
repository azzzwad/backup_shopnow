export class Subcategory {
  id: string;
  subcategoryLogo: string;
  subcategoryName: string;
  category: string;

  postedOn: string;
  constructor(
    id: string,
    subcategoryLogo: string,
    subcategoryName: string,
    category: string,
    postedOn: string
  ) {
    this.id = id;
    this.subcategoryLogo = subcategoryLogo;
    this.subcategoryName = subcategoryName;
    this.category = category;
    this.postedOn = postedOn;
  }
}
