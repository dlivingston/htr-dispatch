import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Ticket } from '../ticket';
import { Subject } from 'rxjs/Subject';
import { StatusFilterPipe } from '../status-filter.pipe';
import { PriorityFilterPipe } from '../priority-filter.pipe';
import 'rxjs/add/operator/map';

@Component({
	selector: 'app-ticket-list',
	templateUrl: './ticket-list.component.html',
	styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
	tickets: FirebaseListObservable<any[]>;
	techs: FirebaseListObservable<any[]>;
	currentUser: FirebaseObjectObservable<any>;
	idSubject: Subject<any>;
	clientNameSubject: Subject<any>;
	prioritySubject: Subject<any>;
	sortAscending: boolean;
	viewFilter: boolean;
	selectedOption: {};
	orderByOptions: [{}] = [
		{ value: "id", label : "Ticket ID" },
		{ value: "client_name", label : "Client Name" },
		{ value: "assigned_tech", label : "Assigned Tech" },
		{ value: "sched_srvc_date", label : "Sched. Service" },
		{ value: "last_updated", label : "Last Updated" },
		{ value: "priority", label : "Priority" }
	];
	statusFilterOptions: any[];
	priorityFilterOptions: any[];
	assignedTechFilterOptions: any[];
	showSpinner: boolean = true;

	constructor(public authService: AuthService, public af: AngularFireDatabase, private router:Router) {
		this.idSubject = new Subject();
		this.clientNameSubject = new Subject();
		this.prioritySubject = new Subject();
		this.authService.user.subscribe(user => {
			if(user) { 
				this.currentUser = this.af.object('/users/' + user.uid);
			}
			this.showSpinner = false;
		});
		this.tickets = af.list('/tickets', {
			query: {
				orderByChild: 'id',
			}
		});
		this.techs = af.list('/techs', {});
		this.selectedOption = this.orderByOptions[0];
		this.sortAscending = true;
		this.viewFilter = false;
		this.statusFilterOptions = ['All'];
		this.priorityFilterOptions = ['All'];
		this.assignedTechFilterOptions = ['All'];	}

	orderBy(option: {value: string, label: string}) {
		this.selectedOption = option;
		if(this.sortAscending){
			this.tickets = this.af.list('/tickets', {
				query: {
					orderByChild: option.value,
				}
			});
		} else {
			this.tickets = this.af.list('/tickets', {
				query: {
					orderByChild: option.value,
				}
			}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
		}
	}

	toggleAscending() {
		this.sortAscending ? this.sortAscending = false : this.sortAscending = true;
		this.orderBy(this.selectedOption as any);
	}

	toggleFilterPanel() {
		this.viewFilter ? this.viewFilter = false : this.viewFilter = true;
	}

	toggleStatusFilterOptions(status: string) {
		if(status === 'All') {
			this.statusFilterOptions = ['All'];
			return null;
		}
		if(this.statusFilterOptions.indexOf(status) === -1){
			if(this.statusFilterOptions.indexOf('All') === 0) {
				this.statusFilterOptions = [];
			}
			this.statusFilterOptions.push(status);
		} else {
			this.statusFilterOptions.splice(this.statusFilterOptions.indexOf(status), 1);
		}
	}

	togglePriorityFilterOptions(priority: string) {
		if(priority === 'All') {
			this.priorityFilterOptions = ['All'];
			return null;
		}
		if(this.priorityFilterOptions.indexOf(priority) === -1){
			if(this.priorityFilterOptions.indexOf('All') === 0) {
				this.priorityFilterOptions = [];
			}
			this.priorityFilterOptions.push(priority);
		} else {
			this.priorityFilterOptions.splice(this.priorityFilterOptions.indexOf(priority), 1);
		}
	}

	toggleAssignedTechFilterOptions(tech: string) {
		if(tech === 'All') {
			this.assignedTechFilterOptions = ['All'];
			return null;
		}
		if(this.assignedTechFilterOptions.indexOf(tech) === -1){
			if(this.assignedTechFilterOptions.indexOf('All') === 0) {
				this.assignedTechFilterOptions = [];
			}
			this.assignedTechFilterOptions.push(tech);
		} else {
			this.assignedTechFilterOptions.splice(this.assignedTechFilterOptions.indexOf(tech), 1);
		}
	}

	ngOnInit() {
	}

}
