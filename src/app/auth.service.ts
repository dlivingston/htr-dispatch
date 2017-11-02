import { Injectable } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
	user: Observable<firebase.User>;

	constructor(private firebaseAuth: AngularFireAuth) {
		this.user = firebaseAuth.authState;
	}

	login(email: string, password: string) {
		console.log("login");
		this.firebaseAuth
		.auth
		.signInWithEmailAndPassword(email, password)
		.then(value => {
			//console.log('Nice, it worked!');
		})
		.catch(err => {
			console.log('Something went wrong:',err.message);
		});
	}

	logout() {
		this.firebaseAuth
		.auth
		.signOut();
	}

}
