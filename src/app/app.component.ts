import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';
import { TicketService } from './ticket.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
    providers: [TicketService],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	tickets: FirebaseListObservable<any[]>;
	email: string = '';
	password: string  = '';

	constructor(public authService: AuthService, public af: AngularFireDatabase, private router:Router) {
		this.tickets = af.list('/tickets', {
			query: {
				limitToLast: 50
			}
		});
	}

	login() {
		this.authService.login(this.email, this.password);
		this.email = this.password = '';    
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['']);
	}

	Send(desc: string) {
		this.tickets.push({ });

	}
}
