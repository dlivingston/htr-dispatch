import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Ticket } from '../ticket';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Component({
	selector: 'app-ticket-list',
	templateUrl: './ticket-list.component.html',
	styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
	tickets: FirebaseListObservable<any[]>;
	idSubject: Subject<any>;
	clientNameSubject: Subject<any>;
	prioritySubject: Subject<any>;
	sortAscending: boolean;
	viewFilter: boolean;
	constructor(public authService: AuthService, public af: AngularFireDatabase, private router:Router) { 
		this.idSubject = new Subject();
		this.clientNameSubject = new Subject();
		this.prioritySubject = new Subject();
		this.tickets = af.list('/tickets', {
			query: {
				orderByChild: 'id',
			}
		});
		this.sortAscending = true;
		this.viewFilter = false;

	}

	orderBy(sortValue) {
		console.log("Sort Value", sortValue);
		if(this.sortAscending){
			this.tickets = this.af.list('/tickets', {
				query: {
					orderByChild: sortValue,
				}
			});
		} else {
			this.tickets = this.af.list('/tickets', {
				query: {
					orderByChild: sortValue,
				}
			}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
		}
	}

	toggleAscending() {
		this.sortAscending ? this.sortAscending = false : this.sortAscending = true;
	}

	toggleFilterPanel() {
		this.viewFilter ? this.viewFilter = false : this.viewFilter = true;
	}

	ngOnInit() {
	}

}
