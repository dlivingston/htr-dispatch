import { Component, OnInit, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { UploadService } from '../uploads/shared/upload.service';
import { Upload } from '../uploads/shared/upload';
import 'rxjs/add/operator/take';
import * as _ from "lodash";

@Component({
	selector: 'app-new-service-note',
	templateUrl: './new-service-note.component.html',
	styleUrls: ['./new-service-note.component.scss']
})
export class NewServiceNoteComponent implements OnInit,OnChanges {
	@Input() ticketID: string;
	@Output() addServiceNoteActive = new EventEmitter<boolean>();
	@Output() fileUploadData = new EventEmitter<any>();
	notes: FirebaseListObservable<any[]>;
	private currentUser: FirebaseObjectObservable<any>;
	selectedFiles: FileList;
	currentUpload: Upload;
	serviceNoteInfo: string;
	userId: string;
	userName: string;
	serviceNoteFileDetails: Upload;
	noteTimeStamp: string;

	constructor(public authService: AuthService, public af: AngularFireDatabase, private upSvc: UploadService) {
		this.authService.user.subscribe(user => {
			if(user) { 
				this.userId = user.uid;
				this.currentUser = this.af.object('/users/' + this.userId);
				this.currentUser.subscribe(current => {
					this.userName = current.name;
				});
			}
		});
		this.noteTimeStamp = "note-" + Date.now();
	}

	ngOnInit() {}

 	ngOnChanges() {}

 	saveNote(f: NgForm) {
 		const serviceNotes = this.af.list('/service-notes', {});
 		var now = new Date();	
		const newNote = { 
			ticketID: this.ticketID, 
			userName: this.userName, 
			userId: this.userId, 
			serviceNoteInfo: (f.value.serviceNoteInfo ? f.value.serviceNoteInfo : ''), 
			attachedFileName: (this.serviceNoteFileDetails ? this.serviceNoteFileDetails.name : ''), 
			attachedFileUrl: (this.serviceNoteFileDetails ? this.serviceNoteFileDetails.url : ''), 
			timeStamp: now.toString() 
		};
		serviceNotes.push(newNote);
 		this.addServiceNoteActive.emit(false);
 	}

 	cancelNote(){
 		this.addServiceNoteActive.emit(false);
 	}

 	detectFiles(event) {
		this.selectedFiles = event.target.files;
	}

	addUploadFile(fileDetails: Upload){
		this.serviceNoteFileDetails = fileDetails;
	}

}
