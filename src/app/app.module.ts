import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
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
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { ServiceNoteComponent } from './service-note/service-note.component';
import { NewServiceNoteComponent } from './new-service-note/new-service-note.component';
//import { O2UploadToFbsComponent } from 'o2-upload-to-fbs';
import { UploadFormComponent } from './uploads/upload-form/upload-form.component';
import { StatusFilterPipe } from './status-filter.pipe';
import { PriorityFilterPipe } from './priority-filter.pipe';
import { AssignedTechFilterPipe } from './assigned-tech-filter.pipe';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ListSearchPipe } from './list-search.pipe';

// export const firebaseConfig = {
// 	apiKey: "AIzaSyAH2iBrD3Pu0FO9lolVnKEmVviYAdBOptc",
//     authDomain: "htr-dispatch.firebaseapp.com",
//     databaseURL: "https://htr-dispatch.firebaseio.com",
//     projectId: "htr-dispatch",
//     storageBucket: "htr-dispatch.appspot.com",
//     messagingSenderId: "151102819118"
// };

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
	{ path: 'new-ticket', component: NewTicketComponent },
	{ path: 'ticket-detail/:id', component: TicketDetailsComponent },
	{ path: '', component: LoginComponent },
	{ path: 'upload', component: UploadFormComponent },
	{ path: 'user-details', component: UserDetailsComponent }
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
	StatusFilterPipe,
	PriorityFilterPipe,
	AssignedTechFilterPipe,
	LoadingSpinnerComponent,
	UserDetailsComponent,
	ListSearchPipe,
	],
	imports: [
	BrowserModule,
	FormsModule,
	HttpModule,
	RouterModule.forRoot(
      appRoutes, {}
    ),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
	AngularFireModule.initializeApp(firebaseConfig),
	AngularFireDatabaseModule,
	AngularFireAuthModule
	],
	providers: [AuthService, UploadService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
	bootstrap: [AppComponent]
})
export class AppModule { }
