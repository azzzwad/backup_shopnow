export class Subcategory {
  id: string;
  subcategoryLogo: string;
  subcategoryName: string;

  postedOn: number;
  constructor(
    id: string,
    subcategoryLogo: string,
    subcategoryName: string,

    postedOn: number
  ) {
    this.id = id;
    this.subcategoryLogo = subcategoryLogo;
    this.subcategoryName = subcategoryName;

    this.postedOn = postedOn;
  }
}
