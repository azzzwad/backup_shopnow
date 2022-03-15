import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { DbService } from 'src/app/services/db.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private db: DbService,
    private sanitizer: DomSanitizer,
    private storage: StorageService
  ) {}

  ngOnInit(): void {}
  async addProduct() {
    if (!this.productForm.value.name || this.productForm.value.name == '') {
      alert('Enter your product name');
      return;
    }
    if (
      !this.productForm.value.category ||
      this.productForm.value.brand == ''
    ) {
      alert('Select your product category');
      return;
    }
    // if(!this.productForm.value.description || this.productForm.value.description == ''){

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
}
