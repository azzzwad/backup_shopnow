import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getCookie, deleteCookie } from '../helpers/cookie-utils';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  windowWidth: any = 0;

  currentUser: any;
  constructor(
    private db: DbService,
    private router: Router,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {
    if (getCookie('_new_session')) {
      deleteCookie('_new_session');
      window.location.reload();
    }
    if (getCookie('_user_session')) {
      this.currentUser = JSON.parse(getCookie('_user_session')!);
    }
  }

  ngOnInit(): void {
    console.log(this.currentUser);
  }
  async logout() {
    await this.authService.logout();
    await this.router.navigate(['']);
    window.location.reload();
  }
}
