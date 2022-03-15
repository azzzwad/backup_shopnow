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
import { DbService } from './services/db.service';
import { StorageService } from './services/storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
if (!firebase || !firebase.apps)
  firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService, DbService, StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
