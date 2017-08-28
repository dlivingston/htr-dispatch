import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { AuthService } from './auth.service';

export const firebaseConfig = {
	apiKey: "AIzaSyCu1LlPQz0CBXj4qdnShbcU3xHPGTdn22c",
    authDomain: "htr-beta.firebaseapp.com",
    databaseURL: "https://htr-beta.firebaseio.com",
    projectId: "htr-beta",
    storageBucket: "htr-beta.appspot.com",
    messagingSenderId: "519074297252"
};

const appRoutes: Routes = [
	{ path: 'ticket-list', component: TicketListComponent },
	{ path: 'ticket-detail', component: TicketDetailsComponent },
	{ path: '', component: LoginComponent },
];


@NgModule({
	declarations: [
	AppComponent,
	LoginComponent,
	TicketListComponent,
	TicketDetailsComponent
	],
	imports: [
	BrowserModule,
	FormsModule,
	HttpModule,
	RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
	AngularFireModule.initializeApp(firebaseConfig),
	AngularFireDatabaseModule,
	AngularFireAuthModule
	],
	providers: [AuthService],
	bootstrap: [AppComponent]
})
export class AppModule { }
