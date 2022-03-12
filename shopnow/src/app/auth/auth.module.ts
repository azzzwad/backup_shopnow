import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  {
    path: 'signin',
    component: SigninComponent,
  },
];

@NgModule({
  declarations: [SignupComponent, SigninComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    ToastrModule,
  ],
  providers: [],
})
export class AuthModule {}
