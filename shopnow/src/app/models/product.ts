export class Product {
  id: string;
  productImage: string;
  name: string;
  description: string;

  category: string;
  subcategory: string;

  price: number;
  postedOn: number;
  constructor( 
    id: string,
    productImage: string,
    name: string,
    description: string,
    // price: number,
    category: string,
    subcategory: string,
    // brandLogo: string,
    price: number,
    postedOn: number
  ) {
    this.id = id;
    this.productImage = productImage;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.subcategory = subcategory;
    // this.brandLogo = brandLogo;

    this.postedOn = postedOn;
  }
}
