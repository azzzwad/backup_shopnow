import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  {
    path: 'signin',
    component: SigninComponent,
  },
];

@NgModule({
  declarations: [SignupComponent, SigninComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
