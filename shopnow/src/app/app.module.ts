import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

import { AuthService } from './services/auth.service';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';

if (!firebase || !firebase.apps)
  firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
