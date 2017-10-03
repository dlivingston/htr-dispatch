import { Component, OnInit, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { UploadService } from '../uploads/shared/upload.service';
import { Upload } from '../uploads/shared/upload';
import * as _ from "lodash";

@Component({
	selector: 'app-new-service-note',
	templateUrl: './new-service-note.component.html',
	styleUrls: ['./new-service-note.component.scss']
})
export class NewServiceNoteComponent implements OnInit,OnChanges {
	@Input() ticketID: string;
	@Output() addServiceNoteActive = new EventEmitter<boolean>();
	notes: FirebaseListObservable<any[]>;
	selectedFiles: FileList;
	currentUpload: Upload;
	serviceNoteInfo: string;

	constructor(public af: AngularFireDatabase, private upSvc: UploadService) {}

	ngOnInit() {}

 	ngOnChanges() {
 		console.log("OnChanges TicketID ", this.ticketID);
 	}

 	saveNote(f: NgForm) {
 		console.log("Save Note", this.ticketID, f.value);
 		this.notes = this.af.list('/service-notes', {});
 		var now = new Date();		
 		var strServiceNoteText;
 		var attachedFileName;
 		if(this.selectedFiles){ 
 			let file = this.selectedFiles.item(0);
 			this.currentUpload = new Upload(file);
 			attachedFileName = file.name; 
 		} else { 
 			attachedFileName = ""; 
 		}
 		if(f.value.serviceNoteInfo){ strServiceNoteText = f.value.serviceNoteInfo} else {strServiceNoteText = ""}
 		this.notes.push({ticketID: this.ticketID, serviceNoteInfo: strServiceNoteText, attachedFileName: attachedFileName, timeStamp: now.toString()})
 			.then((note) => { 
 				if(this.selectedFiles){
 					this.upSvc.pushUpload(note.key, this.currentUpload)
 				} 
 			});
 		this.addServiceNoteActive.emit(false);
 	}

 	cancelNote(){
 		this.addServiceNoteActive.emit(false);
 	}

 	detectFiles(event) {
		this.selectedFiles = event.target.files;
		console.log('File Selected');
	}

}
