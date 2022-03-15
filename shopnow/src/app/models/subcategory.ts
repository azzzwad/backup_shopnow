export class Subcategory {
  id: string;
  subcategoryLogo: string;
  subcategoryName: string;
  category: string;

  postedOn: number;
  constructor(
    id: string,
    subcategoryLogo: string,
    subcategoryName: string,
    category: string,
    postedOn: number
  ) {
    this.id = id;
    this.subcategoryLogo = subcategoryLogo;
    this.subcategoryName = subcategoryName;
    this.category = category;
    this.postedOn = postedOn;
  }
}
