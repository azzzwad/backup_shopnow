import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryManagementComponent } from './category-management/category-management.component';

import { UserManagementComponent } from './user-management/user-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  { path: 'category', component: CategoryManagementComponent },
  { path: 'user', component: UserManagementComponent },
  { path: 'product', component: ProductManagementComponent },
  { path: 'order', component: OrderManagementComponent },
];
@NgModule({
  declarations: [
    CategoryManagementComponent,

    UserManagementComponent,
    ProductManagementComponent,
    OrderManagementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
