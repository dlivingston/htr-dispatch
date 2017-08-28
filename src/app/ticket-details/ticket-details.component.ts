import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {

  constructor(public authService: AuthService, public af: AngularFireDatabase, private router:Router) { }

  ngOnInit() {
  	// const key: string;
   //  this.route.params.take(1).subscribe(param => key = param["id"]);
  }

}
