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
import { UploadService } from './uploads/shared/upload.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { ServiceNoteComponent } from './service-note/service-note.component';
import { NewServiceNoteComponent } from './new-service-note/new-service-note.component';
//import { O2UploadToFbsComponent } from 'o2-upload-to-fbs';
import { UploadFormComponent } from './uploads/upload-form/upload-form.component';
export const firebaseConfig = {
	apiKey: "AIzaSyAH2iBrD3Pu0FO9lolVnKEmVviYAdBOptc",
    authDomain: "htr-dispatch.firebaseapp.com",
    databaseURL: "https://htr-dispatch.firebaseio.com",
    projectId: "htr-dispatch",
    storageBucket: "htr-dispatch.appspot.com",
    messagingSenderId: "151102819118"
};

const appRoutes: Routes = [
	{ path: 'ticket-list', component: TicketListComponent },
	{ path: 'new-ticket', component: NewTicketComponent },
	{ path: 'ticket-detail/:id', component: TicketDetailsComponent },
	{ path: '', component: LoginComponent },
	{ path: 'upload', component: UploadFormComponent }
];


@NgModule({
	declarations: [
	AppComponent,
	LoginComponent,
	TicketListComponent,
	TicketDetailsComponent,
	NewTicketComponent,
	ServiceNoteComponent,
	NewServiceNoteComponent,
	//O2UploadToFbsComponent,
	UploadFormComponent,
	],
	imports: [
	BrowserModule,
	FormsModule,
	HttpModule,
	RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
	AngularFireModule.initializeApp(firebaseConfig),
	AngularFireDatabaseModule,
	AngularFireAuthModule
	],
	providers: [AuthService, UploadService],
	bootstrap: [AppComponent]
})
export class AppModule { }
