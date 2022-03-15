import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Subcategory } from 'src/app/models/subcategory';
import { DbService } from 'src/app/services/db.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';
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

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: [],
      categoryImage: [],
    });
    this.subcategoryForm = this.fb.group({
      subcategoryName: [],
      subcategoryImage: [],
      category: [],
    });
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    // initiate view data
    this.getCategoryData();
    this.getSubcategoryData();
    console.log(this.getCategoryData);
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
        alert('Category Object added successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }
  async addSubcategory() {
    if (
      !this.subcategoryForm.value.subcategoryName ||
      this.subcategoryForm.value.subcategoryName == ''
    ) {
      alert('Enter the name of the subcategory');
      return;
    }

    if (!this.subcategoryForm.value.category) {
      alert('Please Enter a subcategory for you category');
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

    let subcategoryObj = new Subcategory(
      this.id,
      img,
      this.subcategoryForm.value.subcategoryName,
      this.subcategoryForm.value.category,
      this.postedOn
    );

    // save function from db, saving the slideObject
    let result = await this.db.save(
      'Subcategory',
      subcategoryObj.id,
      JSON.parse(JSON.stringify(subcategoryObj))
    );
    // this.spinner.hide();
    try {
      if (result.Success) {
        alert('Subcategory Object added successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // for subcategory module
  selectCategory($event: any) {
    console.log($event.target.value);
    this.subcategoryForm.controls['category'].setValue($event.target.value);
  }
  // function for storing image
  selectImage(ev) {
    this.image = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(ev.target.files[0])
    );
    this.imageFile = ev.target.files[0];
  }

  async getCategoryData() {
    try {
      var result = await this.db.getDocuments('Category', 10);
      if (result.Success) {
        // @ts-ignore
        this.categories = result.Data;
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
}
