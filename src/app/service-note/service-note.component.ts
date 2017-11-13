import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {Subject} from 'rxjs/Subject';
@Component({
	selector: 'app-service-note',
	templateUrl: './service-note.component.html',
	styleUrls: ['./service-note.component.scss']
})
export class ServiceNoteComponent implements OnInit, OnChanges {
	@Input() ticketID: string;
	notes: FirebaseListObservable<any[]>;
	attachedFile: FirebaseObjectObservable<any[]>;
	constructor(public authService: AuthService, public af: AngularFireDatabase) {}

	ngOnInit() {}

	ngOnChanges() {
 		this.notes = this.af.list('/service-notes', {
			query: {
				orderByChild: 'ticketID',
				equalTo: this.ticketID
			}
		});
 	}

}
