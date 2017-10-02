import { Injectable } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Upload } from './upload';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';


@Injectable()
export class UploadService {

	constructor(private db: AngularFireDatabase) { }

	private basePath:string = '/uploads';
	uploads: FirebaseListObservable<Upload[]>;
	note: FirebaseObjectObservable<any>;

	getUploads(query={}) {
		this.uploads = this.db.list(this.basePath, {
			query: query
		});
		return this.uploads
	}


	deleteUpload(upload: Upload) {
		this.deleteFileData(upload.$key)
		.then( () => {
			this.deleteFileStorage(upload.name)
		})
		.catch(error => console.log(error))
	}

	// Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/upload-files
	pushUpload(subfolder: string, upload: Upload) {
		const storageRef = firebase.storage().ref();
		const uploadTask = storageRef.child(`${this.basePath}/${subfolder}/${upload.file.name}`).put(upload.file);

		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
			(snapshot) =>  {
				// upload in progress
				let snap = snapshot as firebase.storage.UploadTaskSnapshot
				upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
			},
			(error) => {
				// upload failed
				console.log(error)
			},
			() => {
				// upload success
				upload.url = uploadTask.snapshot.downloadURL
				upload.name = upload.file.name
				upload.attachedKey = subfolder
				if(subfolder.substring(0, 3) === 'HTR') {
					upload.attachedTo = 'ticket'
				} else {
					upload.attachedTo = 'note'
					this.db.object('/service-notes/' + subfolder).update({attachedFileUrl: upload.url});
				}
				this.saveFileData(upload)
				return undefined
			}
			);
	}

	// Writes the file details to the realtime db
	private saveFileData(upload: Upload) {
		this.db.list(`${this.basePath}/`).push(upload);
	}

	// Writes the file details to the realtime db
	private deleteFileData(key: string) {
		return this.db.list(`${this.basePath}/`).remove(key);
	}

	// Firebase files must have unique names in their respective storage dir
	// So the name serves as a unique key
	private deleteFileStorage(name:string) {
		const storageRef = firebase.storage().ref();
		storageRef.child(`${this.basePath}/${name}`).delete()
	}
}