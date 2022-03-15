import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Subcategory } from 'src/app/models/subcategory';
import { DbService } from 'src/app/services/db.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
})
export class CategoryManagementComponent implements OnInit {
  image: any;
  imageFile: any;

  categories: Category[] = [];
  subcategories: Subcategory[] = [];

  // Forms
  categoryForm!: FormGroup;
  subcategoryForm!: FormGroup;
  id: string;
  postedOn: number;
  constructor(
    private fb: FormBuilder,
    private db: DbService,
    private sanitizer: DomSanitizer,
    private storage: StorageService
  ) {}

  ngOnInit(): void {}
  // function for storing image
  selectImage(ev) {
    this.image = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(ev.target.files[0])
    );
    this.imageFile = ev.target.files[0];
  }
  async addCategory() {
    if (
      !this.categoryForm.value.categoryName ||
      this.categoryForm.value.categoryName == ''
    ) {
      alert('Enter the name of your brand');
      return;
    }

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

    let categoryObj = new Category(
      this.id,
      img,
      this.categoryForm.value.categoryName,
      this.postedOn
    );

    // save function from db, saving the slideObject
    let result = await this.db.save(
      'Category',
      categoryObj.id,
      JSON.parse(JSON.stringify(categoryObj))
    );
    // this.spinner.hide();
    try {
      if (result.Success) {
        alert('Brand Object added successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }
  async subCategory(){
    
  }
}
