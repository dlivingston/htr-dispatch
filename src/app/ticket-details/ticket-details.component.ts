import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import {NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';
import { TicketService } from '../ticket.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Ticket } from '../ticket';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Upload } from '../uploads/shared/upload';
import 'rxjs/add/operator/take';

import 'rxjs/add/operator/switchMap';
@Component({
	selector: 'app-ticket-details',
	templateUrl: './ticket-details.component.html',
	styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
	private ticket: FirebaseObjectObservable<any>;
	private currentUser: FirebaseObjectObservable<any>;
	private techs: FirebaseListObservable<any[]>;
	private attachedFiles: FirebaseListObservable<any[]>;
	id: string;
	private editMode: boolean;
	private partsOrder: boolean;
	private addServiceNoteActive: boolean;
	private ticketPriority: string;
	private ticketStatus: string;
	private ticketAssignedName: string;
	private ticketAssignedId: string;
	private partsOrderedBy: string;
	fileUploads: any[];
	colorTheme = 'theme-default';
	bsConfig: Partial<BsDatepickerConfig>;
	public modalRef: BsModalRef;
	userId: string;

	constructor(public authService: AuthService, public ticketService: TicketService, public af: AngularFireDatabase, private route: ActivatedRoute, private location: Location, private router:Router, private modalService: BsModalService) {
		this.techs = af.list('/techs', {});
		this.route.params.subscribe( params => this.id = params.id );
		this.ticket = this.af.object('/tickets/' + this.id);
		this.ticket.take(1).subscribe(ticket => {
			this.partsOrder = ticket.parts_ordered;
			this.ticketPriority = ticket.priority;
			this.ticketStatus = ticket.status;
			this.ticketAssignedName = ticket.assigned_tech_name;
			this.ticketAssignedId = ticket.assigned_tech;
			this.partsOrderedBy = ticket.parts_ordered_by;
			return ticket;
		});
		this.authService.user.subscribe(user => {
			if(user) { 
				this.currentUser = this.af.object('/users/' + user.uid);
				this.userId = user.uid;
			}
		});
		this.attachedFiles = this.af.list('/uploads', {
			query: {
				orderByChild: 'attachedKey',
				equalTo: this.id
			}
		});
		this.editMode = false;
		this.addServiceNoteActive = false;
		this.bsConfig = Object.assign({}, {containerClass: this.colorTheme});
	}

	updateTicket(f: NgForm) {
		this.ticket = this.af.object('/tickets/' + this.id);
		var now = new Date();
		if(f.value.address_city){ this.ticket.update({address_city : f.value.address_city}); }
		if(f.value.address_ln1) { this.ticket.update({address_ln1 : f.value.address_ln1}); }
		if(f.value.address_ln2) { this.ticket.update({address_ln2 : f.value.address_ln2}); }
		if(f.value.address_state) { this.ticket.update({address_state : f.value.address_state}); }
		if(f.value.address_zip) { this.ticket.update({address_zip : f.value.address_zip}); }
		if(f.value.alt_contact_email) { this.ticket.update({alt_contact_email : f.value.alt_contact_email}); }
		if(f.value.alt_contact_name) { this.ticket.update({alt_contact_name : f.value.alt_contact_name}); }
		if(f.value.alt_contact_phone) { this.ticket.update({alt_contact_phone : f.value.alt_contact_phone}); }
		// if(f.value.assigned_tech) { this.ticket.update({assigned_tech : f.value.assigned_tech}); }
		this.ticket.update({ assigned_tech_name: this.ticketAssignedName });
		this.ticket.update({ assigned_tech: this.ticketAssignedId });
		if(f.value.callback) { this.ticket.update({callback : f.value.callback}); } else { this.ticket.update({callback : false}); }
		if(f.value.client_loc_id) { this.ticket.update({client_loc_id : f.value.client_loc_id}); }
		if(f.value.client_name) { this.ticket.update({client_name : f.value.client_name}); }
		if(f.value.short_desc) { 
			if(f.value.short_desc.length > 50) {
				var shortDesc = f.value.short_desc.slice(0, 50);
				this.ticket.update({short_desc : shortDesc});
			} else {
				this.ticket.update({short_desc : f.value.short_desc}); 
			}
		}
		if(f.value.desc_notes) { this.ticket.update({desc_notes : f.value.desc_notes}); }
		if(f.value.discount_partial) { this.ticket.update({discount_partial : f.value.discount_partial}); } else { this.ticket.update({discount_partial : false}); }
		if(f.value.estPartArrDate) { this.ticket.update({estPartArrDate : f.value.estPartArrDate}); }
		if(f.value.parts_ordered) { this.ticket.update({parts_ordered : f.value.parts_ordered}); } else { this.ticket.update({parts_ordered : false}); }
		// if(f.value.parts_ordered_by) { this.ticket.update({parts_ordered_by : f.value.parts_ordered_by}); }
		this.ticket.update({ parts_ordered_by: this.partsOrderedBy });
		if(f.value.parts_vendor) { this.ticket.update({parts_vendor : f.value.parts_vendor}); }
		if(f.value.primary_contact_email) { this.ticket.update({primary_contact_email : f.value.primary_contact_email}); }
		if(f.value.primary_contact_name) { this.ticket.update({primary_contact_name : f.value.primary_contact_name}); }
		if(f.value.primary_contact_phone) { this.ticket.update({primary_contact_phone : f.value.primary_contact_phone}); }
		// if(f.value.priority) { this.ticket.update({priority : f.value.priority}); }
		this.ticket.update({priority: this.ticketPriority});
		if(f.value.sched_srvc_date) { this.ticket.update({sched_srvc_date : f.value.sched_srvc_date}); } else { this.ticket.update({sched_srvc_date : ''}); }
		this.ticket.update({status: this.ticketStatus});
		// if(f.value.status) { this.ticket.update({status : f.value.status}); }
		this.ticket.update({last_updated : now});
		this.ticket.update({last_updated_by : this.userId});
		this.toggleEditMode();
	}

	deleteTicket(){
		this.af.object('/tickets/' + this.id).remove()
		.then(_ => {
			this.modalRef.hide();
			this.router.navigate(['ticket-list']);
		})
		.catch(err => console.log("Delete Error", err));
	}

	confirmDelete(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	toggleEditMode() {
		this.editMode ? this.editMode = false : this.editMode = true;
	}

	togglePartsOrderedPanel() {
		this.partsOrder ? this.partsOrder = false : this.partsOrder = true;
	}

	toggleActiveServiceNote(active: boolean){
		this.addServiceNoteActive = active;
	}

	setTicketPriority(level: string){
		this.ticketPriority = level;
	}

	setTicketStatus(status: string){
		this.ticketStatus = status;
	}

	getAttachedFiles(){

	}

	addUploadFile(fileDetails: Upload){
	}

	onAssignedTechChange(value){
		this.ticketAssignedName = value.name;
		this.ticketAssignedId = value.$key;
	}

	onPartsOrderedByChange(value) {
		this.partsOrderedBy = value.name;
	}

	compareFn(optionOne, optionTwo): boolean {
		return optionOne.name === optionTwo.assigned_tech_name;
	}

	comparePoTech(optionOne, optionTwo): boolean {
		return optionOne.name === optionTwo.parts_ordered_by;
	}

	ngOnInit() {

	}

}
