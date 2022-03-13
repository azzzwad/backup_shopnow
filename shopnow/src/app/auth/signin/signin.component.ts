import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  public signInForm: FormGroup;
  constructor(
    private _fb: FormBuilder,

    private authservice: AuthService,
    private router: Router,

    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signInForm = this._fb.group({
      email: [],
      password: [],
    });
  }
  async signin() {
    try {
      if (!this.authservice.validateEmail(this.signInForm.value.email)) {
        alert('Enter correct email!');
        return;
      }
      if (this.signInForm.value.password.length < 6) {
        alert('Enter at least 6 letter password');
        return;
      }

      // await this.spinner.show();
      this.authservice
        .login(this.signInForm.value.email, this.signInForm.value.password)
        .then(async (res) => {
          // await this.spinner.hide();
          if (res.Success) {
            alert('Logged in');
            if (res.Message.role != 'sa') {
              if (!res.Message.profileComplete) {
                alert('Please complete your profile');
                await this.router.navigateByUrl(
                  '/' + res.Message.role + '/' + res.Message.role + '-profile'
                );
              } else {
                await this.router.navigateByUrl('');
              }
            } else {
              await this.router.navigateByUrl('');
            }
          } else {
            alert(res.Message);
          }
        });
    } catch (e) {
      alert(e);
    }
  }

  async sendForgotRequest() {
    try {
      if (!this.authservice.validateEmail(this.signInForm.value.email)) {
        alert('Please enter a valid email');
        return;
      }

      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebaseConfig);
      }

      // await this.spinner.show();
      firebase
        .auth()
        .sendPasswordResetEmail(this.signInForm.value.email)
        .then(async (res) => {
          // await this.spinner.hide();
          this.forgotModal.nativeElement.click();
          alert(
            'Reset request sent. Check your email for resetting your password.'
          );
        })
        .catch((error) => {
          // this.spinner.hide();
          alert(error);
        });
    } catch (e) {
      // await this.spinner.hide();
      alert(e);
    }
  }
  signInWithGoogle() {
    // this.spinner.show();
    this.authservice.signInWithGoogle().then(async (res) => {
      // await this.spinner.hide();
      if (res.Success) {
        alert('Logged in');
        if (!res.Message.profileComplete) {
          alert('Please complete your profile');
          await this.router.navigateByUrl(
            '/' + res.Message.role + '/' + res.Message.role + '-profile'
          );
        } else {
          await this.router.navigateByUrl('');
        }
      } else {
        alert(res.Message);
        console.log(res.Message);
      }
    });
  }

  async signInWithFacebook() {
    // await this.spinner.show();
    this.authservice.signInWithFacebook().then(async (res) => {
      // await this.spinner.hide();
      if (res.Success) {
        alert('Logged in');
        if (!res.Message.profileComplete) {
          alert('Please complete your profile');
          await this.router.navigateByUrl(
            '/' + res.Message.role + '/' + res.Message.role + '-profile'
          );
        } else {
          await this.router.navigateByUrl('');
        }
      } else {
        alert(res.Message);
        console.log(res.Message);
      }
    });
  }
}
