import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  //=======Sign up ====
  @ViewChild('otpModal', { static: true }) otpModal: ElementRef;
  public signUpForm: FormGroup;
  public otpForm: FormGroup;

  windowRef: any;

  verificationCode: string;
  number: string;
  screenSize = 0;
  agree = false;
  constructor(
    private _fb: FormBuilder,
    private toastr: ToastrService,

    private authservice: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    let body = document.getElementById('auth-body');

    if (body) body.style.opacity = '0';

    setTimeout(() => {
      if (body) body.style.opacity = '100%';
      this.windowRef = window;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container'
      );
      this.windowRef.recaptchaVerifier.render();
    }, 1000);

    this.signUpForm = this._fb.group({
      mobile: [],
      email: [],
      password: [],
      repassword: [],
      role: [],
    });
    this.route.queryParams.subscribe((params) => {
      if (params.type) {
        this.signUpForm.controls['role'].setValue(params.type);
      }
    });

    this.otpForm = this._fb.group({
      otp: [],
    });
  }
  selectRole(value: string) {
    this.signUpForm.controls['role'].setValue(value);
  }

  signUp() {
    if (!this.signUpForm.value.role || this.signUpForm.value.role === '') {
      this.toastr.warning('Select either USER or COMPANY type', null, {
        timeOut: 3000,
      });
      return;
    }

    if (!this.authservice.validateEmail(this.signUpForm.value.email)) {
      this.toastr.warning('Enter correct email!', null, { timeOut: 3000 });
      return;
    }

    if (
      this.signUpForm.value.mobile == null ||
      this.signUpForm.value.mobile === '' ||
      !this.signUpForm.value.mobile.startsWith('+')
    ) {
      this.toastr.warning('Enter valid mobile number with full country code');
      return;
    }

    if (
      !this.signUpForm.value.password ||
      this.signUpForm.value.password === '' ||
      this.signUpForm.value.password.length < 6
    ) {
      this.toastr.warning('Enter password at least 6 characters long');
      return;
    }

    if (
      !this.signUpForm.value.repassword ||
      this.signUpForm.value.repassword === '' ||
      this.signUpForm.value.password != this.signUpForm.value.repassword
    ) {
      this.toastr.warning("Password didn't match, retype passwords again");
      return;
    }

    const appverifier = this.windowRef.recaptchaVerifier;

    if (!appverifier) {
      this.toastr.error('Please check recaptha');
      return;
    }
    //
    this.number = this.signUpForm.value.mobile;
    // if (!this.number.startsWith('+8801')) {
    //   this.number = '+88' + this.signUpForm.value.mobile;
    // }
    // this.spinner.show();

    firebase
      .auth()
      .signInWithPhoneNumber(this.number, appverifier)
      .then((result) => {
        this.spinner.hide();
        this.windowRef.confirmationResult = result;
        this.otpModal.nativeElement.click();
      })
      .catch((error) => {
        this.spinner.hide();
        this.toastr.error(error);
      });
  }

  async confirmOtp() {
    try {
      if (
        this.otpForm.value.otp == null ||
        this.otpForm.value.otp === '' ||
        this.otpForm.value.otp.length < 3
      ) {
        this.toastr.warning('enter correct OTP');
        return;
      }

      await this.spinner.show();
      this.windowRef.confirmationResult
        .confirm(this.otpForm.value.otp)
        .then(async (res) => {
          this.otpModal.nativeElement.click();
          await this.submit();
        })
        .catch(async (error) => {
          await this.spinner.hide();
          this.toastr.error(error);
        });
    } catch (e) {
      this.toastr.error(e);
    }
  }

  async submit() {
    try {
      this.authservice
        .signUpWithEmailAndPassword(
          this.number,
          this.signUpForm.value.email,
          this.signUpForm.value.password,
          this.signUpForm.value.role
        )
        .then(async (res) => {
          await this.spinner.hide();
          if (res.Success) {
            this.toastr.success(res.Message);
            if (!res.Message.profileComplete) {
              this.toastr.info('Please complete your profile');
              await this.router.navigateByUrl(
                '/' + res.Message.role + '/' + res.Message.role + '-profile'
              );
            } else {
              await this.router.navigateByUrl('');
            }
          } else {
            this.toastr.error(res.Message);
          }
        });
    } catch (e) {
      await this.spinner.hide();
      console.log(e);
    }
  }

  async signUpWithGoogle() {
    if (!this.signUpForm.value.role || this.signUpForm.value.role === '') {
      this.toastr.warning('Select either USER or COMPANY type', null, {
        timeOut: 3000,
      });
      return;
    }
    await this.spinner.show();
    this.authservice
      .signUpWithGoogle(this.signUpForm.value.role)
      .then(async (res) => {
        await this.spinner.hide();
        if (res.Success) {
          this.toastr.success(res.Message);
          if (!res.Message.profileComplete) {
            this.toastr.info('Please complete your profile');
            await this.router.navigateByUrl(
              '/' + res.Message.role + '/' + res.Message.role + '-profile'
            );
          } else {
            await this.router.navigateByUrl('');
          }
        } else {
          this.toastr.error(res.Message);
          console.log(res.Message);
        }
      });
  }

  async signUpWithFacebook() {
    if (!this.signUpForm.value.role || this.signUpForm.value.role === '') {
      this.toastr.warning('Select either USER or COMPANY type', null, {
        timeOut: 3000,
      });
      return;
    }
    await this.spinner.show();
    this.authservice
      .signUpWithFacebook(this.signUpForm.value.role)
      .then(async (res) => {
        await this.spinner.hide();
        if (res.Success) {
          this.toastr.success(res.Message);
          if (!res.Message.profileComplete) {
            this.toastr.info('Please complete your profile');
            await this.router.navigateByUrl(
              '/' + res.Message.role + '/' + res.Message.role + '-profile'
            );
          } else {
            await this.router.navigateByUrl('');
          }
        } else {
          this.toastr.error(res.Message);
          console.log(res.Message);
        }
      });
  }
}
