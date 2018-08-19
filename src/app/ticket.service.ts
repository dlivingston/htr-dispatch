import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Ticket } from './ticket';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TicketService {
	private tickets: FirebaseListObservable<any[]>;
	private ticket: FirebaseObjectObservable<any>;

	selectedTicket: BehaviorSubject<any>;

	constructor(public af: AngularFireDatabase) { }


	getTickets() {
		this.tickets = this.af.list('/tickets', {} );
		return this.tickets;
	}

	getTicket(id: string) {
		this.ticket = this.af.object('/tickets/' + id);
		this.ticket.subscribe(ticket => {
			return ticket;
		});
	}
}
