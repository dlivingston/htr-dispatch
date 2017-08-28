import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
	tickets: FirebaseListObservable<any[]>;
  constructor(public authService: AuthService, public af: AngularFireDatabase, private router:Router) { 
  	this.tickets = af.list('/tickets', {
		query: {
			// limitToLast: 50
		}
	});
  }

  ngOnInit() {
  }

}
