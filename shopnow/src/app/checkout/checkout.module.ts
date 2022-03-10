import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'proceed-to-checkout',
    component: CheckoutComponent,
  },
];
@NgModule({
  declarations: [CartComponent, CheckoutComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CheckoutModule {}
