import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product';
import { DbService } from 'src/app/services/db.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { SearchFilterPipe } from 'src/app/Pipes/search-filter.pipe';
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  productForm!: FormGroup;
  id!: string;
  postedOn!: number;
  imageFile: any;
  image: any;

  categories: any[]; // what is this?????? for storing cat from get data,padand for html file, let cat of categories

  subcategories: any[];
  selectedcategory: any;

  rows;
  columns;
  data;

  ColumnMode = ColumnMode;

  searchTerm: string;

  @ViewChild('myTable') table: any;

  expanded: any = {};
  result: any[];
  products: any[];
  constructor(
    private fb: FormBuilder,
    private db: DbService,
    private sanitizer: DomSanitizer,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productImage: [],
      description: [],
      name: [],
      category: [],
      subcategory: [],
      price: [],
    });
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }

    // initiate view data
    this.getCategoryData();
    this.getSubcategoryData();
    this.getProductData();
  }
  async addProduct() {
    if (!this.productForm.value.name || this.productForm.value.name == '') {
      alert('Enter your product name');
      return;
    }
    if (
      !this.productForm.value.category ||
      this.productForm.value.category == ''
    ) {
      alert('Select your product category');
      return;
    }

    // }
    // variable for holding uploaded image file data

    let img;

    // function for uploading to storage service
    if (this.imageFile) {
      // this.spinner.show();
      // let id = Date.now().toString();

      // this.spinner.show();
      let upload = await this.storage.uploadImageFileAndGetUrl(this.imageFile);
      if (upload.Success) {
        img = upload.Data;
      } else {
        alert(upload.Data);
        // this.spinner.hide();
        // this.toaster.error(upload.Data);
        return;
      }
    } else {
      alert('no image found');
      return;
    }

    // id and postedOn variable for slider object id and posted time
    this.id = JSON.stringify(new Date().getTime());
    this.postedOn = new Date().getTime();

    let productObj = new Product(
      this.id,
      img,
      this.productForm.value.name,
      this.productForm.value.description,
      this.productForm.value.category,
      this.productForm.value.subcategory,
      this.productForm.value.price,
      this.postedOn
    );

    // save function from db, saving the slideObject
    let result = await this.db.save(
      'Product',
      productObj.id,
      JSON.parse(JSON.stringify(productObj))
    );
    // this.spinner.hide();
    try {
      if (result.Success) {
        alert('Product Object added successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }
  selectImage(ev) {
    this.image = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(ev.target.files[0])
    );
    this.imageFile = ev.target.files[0];
  }
  selectCategory($event: any) {
    console.log($event.target.value);
    this.selectedcategory = $event.target.value;
    console.log(this.selectCategory);
    this.productForm.controls['category'].setValue($event.target.value);
  }
  selectSubcategory($event: any) {
    console.log($event.target.value);
    this.productForm.controls['subcategory'].setValue($event.target.value);
  }

  async getProductData() {
    try {
      var result = await this.db.getDocuments('Product', 10);
      if (result.Success) {
        // @ts-ignore
        this.rows = result.Data;
        this.products = result.Data;
        console.log(this.products);
      }
    } catch (error) {
      console.log(error);
    }
    this.columns = [
      {
        prop: 'name',
        name: 'Name',
        width: 500,
      },
      {
        prop: 'price',
        name: 'Price',
      },
      {
        prop: 'category',
        name: 'Category',
      },
      {
        prop: 'subcategory',
        name: 'Subcategory',
        width: 200,
      },
      {
        prop: 'description',
        name: 'Description',
        width: 700,
      },
    ];
  }
  async getCategoryData() {
    try {
      var result = await this.db.getDocuments('Category', 10);
      if (result.Success) {
        // @ts-ignore
        this.categories = result.Data;
        console.log(this.categories);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getSubcategoryData() {
    try {
      var result = await this.db.getDocuments('Subcategory', 10);
      if (result.Success) {
        // @ts-ignore
        this.subcategories = result.Data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
  // search(value: string): void {
  //   this.result = this.products.filter((val) =>
  //     val.name.toLowerCase().includes(value)
  //   );
  //   // console.log(this.products);
  // }
  search(value: string): void {
    this.result = this.products.filter((val) =>
      val.name.toLowerCase().includes(value)
    );
    console.log(this.result);
  }
}
