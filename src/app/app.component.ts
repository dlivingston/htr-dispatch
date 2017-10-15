import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
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
	currentUser: FirebaseObjectObservable<any>;
	email: string = '';
	password: string  = '';

	constructor(public authService: AuthService, public af: AngularFireDatabase, private router:Router) {
		this.authService.user.subscribe(user => {
			if(user) { 
				this.currentUser = this.af.object('/users/' + user.uid);
			}
		});
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['']);
	}

}
