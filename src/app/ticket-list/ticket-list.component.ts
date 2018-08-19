import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Ticket } from '../ticket';
import { Subject } from 'rxjs/Subject';
// import { StatusFilterPipe } from '../status-filter.pipe';
// import { PriorityFilterPipe } from '../priority-filter.pipe';
import 'rxjs/add/operator/map';
import { LimitToOptions } from 'angularfire2/interfaces';

@Component({
    selector: 'app-ticket-list',
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
    tickets: FirebaseListObservable<any[]>;
    ticketsList: FirebaseObjectObservable<any>;

    activeTicketsList: FirebaseListObservable<any[]>;
    activeTicket: FirebaseObjectObservable<any>;
    activeTicketsArray: any[];
    inactiveTicketsArray: any[];
    archivedTicketsArray: any[];
    
    assignedTicketsList: FirebaseListObservable<any[]>;

    techs: FirebaseListObservable<any[]>;
    currentUser: FirebaseObjectObservable<any>;
    currentUserId: string;
    currentUserName: string;
    currentUserIsTech: boolean;
    idSubject: Subject<any>;
    clientNameSubject: Subject<any>;
    prioritySubject: Subject<any>;
    sortAscending: boolean;
    viewFilter: boolean;
    viewOptions: boolean;
    fullListView: boolean;
    listView: string;

    selectedOption: any;
    newestTicket: FirebaseListObservable<any[]>;
    newestTicketId: string;
    firstTicket: FirebaseListObservable<any[]>;
    firstTicketId: string;
    currentPageStart: string;
    nextPageStart: string;
    prevPageStart: string;
    prevBtnActive: boolean;
    nextBtnActive: boolean;
    orderByOptions: any[] = [
        { value: 'id', label : 'Ticket ID' },
        { value: 'client_name', label: 'Client Name' },
        { value: 'client_loc_id', label: 'Location' },
        { value: 'assigned_tech', label : 'Assigned Tech' },
        { value: 'priority', label: 'Priority' },
        { value: 'sched_srvc_date', label: 'Sched. Service' }
    ];
    statusFilterOptions: any[];
    priorityFilterOptions: any[];
    assignedTechFilterOptions: any[];
    listLimit: number;
    constructor(public authService: AuthService, public af: AngularFireDatabase, private router: Router) {
        this.idSubject = new Subject();
        this.clientNameSubject = new Subject();
        this.prioritySubject = new Subject();
        this.statusFilterOptions = [];
        this.priorityFilterOptions = [];
        this.assignedTechFilterOptions = [];
        this.selectedOption = this.orderByOptions[0];
        this.nextPageStart = '';
        this.prevPageStart = '';
        this.prevBtnActive = false;
        this.nextBtnActive = true;
        this.fullListView = false;
        this.listLimit = 50;
        this.activeTicketsArray = [];
        this.inactiveTicketsArray = [];
        this.archivedTicketsArray = [];
        this.authService.user.subscribe(auth_user => {
            if (auth_user) {
                this.currentUserId = auth_user.uid;
                this.currentUser = this.af.object('/users/' + auth_user.uid);
                let tech = this.af.object('/techs/' + auth_user.uid, { preserveSnapshot: true});
                tech.subscribe(snapshot => {
                    if (snapshot.val()) {
                        this.currentUserIsTech = true;
                       
                        
                    } else {
                        this.currentUserIsTech = false;
                    }
                    this.currentUser.subscribe(current_user => {
                        this.currentUserName = current_user.name;

                        if (current_user.selectedListView) {
                            this.listView = current_user.selectedListView;
                            this.toggleListView(current_user.selectedListView);
                        } else {
                            if (this.currentUserIsTech) {
                                // this.listView = 'assigned';
                                this.toggleListView('assigned');
                            } else {
                                // this.listView = 'paged';
                                this.toggleListView('paged');
                            }
                        }

                        if (current_user.statusFilterOptions) {
                            this.statusFilterOptions = current_user.statusFilterOptions;
                        } else {
                            this.statusFilterOptions = ['All'];
                        }
                        if (current_user.priorityFilterOptions) {
                            this.priorityFilterOptions = current_user.priorityFilterOptions;
                        } else {
                            this.priorityFilterOptions = ['All'];
                        }
                        if (current_user.assignedTechFilterOptions) {
                            this.assignedTechFilterOptions = current_user.assignedTechFilterOptions;
                        } else {
                            this.assignedTechFilterOptions = ['All'];
                        }
                        if (current_user.selectedOrder) {
                            this.selectedOption = current_user.selectedOrder;
                        } else {
                            this.selectedOption = this.orderByOptions[0];
                        }
                        if (current_user.sortAscending) {
                            this.sortAscending = current_user.sortAscending;
                        } else {
                            this.sortAscending = false;
                        }
                    });
                });
                
                
            }
        });
        this.newestTicket = af.list('/tickets', {
            preserveSnapshot: true,
            query: {
                limitToLast: 1,
                orderByKey: true
            }
        });
        this.newestTicket.subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.newestTicketId = snapshot.key;
                const currentPageNum = ('0000000' + (this.parseTicketNum(this.newestTicketId) - (this.listLimit - 1)).toString()).slice(-7);
                this.currentPageStart = ['HTR-', currentPageNum.slice(0, 3), '-', currentPageNum.slice(3)].join('');
                const nextPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) - this.listLimit).toString()).slice(-7);
                this.nextPageStart = ['HTR-', nextPageNum.slice(0, 3), '-', nextPageNum.slice(3)].join('');
                const prevPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) + this.listLimit).toString()).slice(-7);
                this.prevPageStart = ['HTR-', prevPageNum.slice(0, 3), '-', prevPageNum.slice(3)].join('');
            });
        });

        this.firstTicket = af.list('/tickets', {
            preserveSnapshot: true,
            query: {
                limitToFirst: 1,
                orderByKey: true
            }
        });
        this.firstTicket.subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.firstTicketId = snapshot.key;
            });
        });
        this.techs = af.list('/techs', {});
        this.viewFilter = false;
        this.viewOptions = false;
    }

    orderBy(option: {value: string, label: string}) {
        this.selectedOption = option;
        this.currentUser.update({ selectedOrder: this.selectedOption });

    }

    setStatusView(view) {
        if(view === 'active') {
            this.statusFilterOptions = ['Assigned', 'Hold', 'Unassigned'];
            this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
        }
        if (view === 'inactive') {
            this.statusFilterOptions = ['Invoiced'];
            this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
        }
        if (view === 'archived') {
            this.statusFilterOptions = ['Closed'];
            this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
        }
    }


    toggleListView(listView) {
        this.listView = listView;
        if(listView === 'assigned') {
            this.currentUser.update({ selectedListView: this.listView });
            this.tickets = this.af.list('/tickets', {
                query: {
                    orderByChild: 'assigned_tech',
                    equalTo: this.currentUserId
                }
            });
        }
        if (listView === 'paged') {
            this.currentUser.update({ selectedListView: this.listView });
            this.tickets = this.af.list('/tickets', {
                query: {
                    orderByChild: 'id',
                    limitToLast: this.listLimit
                }
            });
        }
        if (listView === 'full') {
            this.currentUser.update({ selectedListView: this.listView });
            this.tickets = this.af.list('/tickets', {
                query: {
                    orderByChild: 'id'
                }
            });
        }
    }

    toggleAscending() {
        this.sortAscending ? this.sortAscending = false : this.sortAscending = true;
        this.currentUser.update({ sortAscending: this.sortAscending });
    }

    toggleFilterPanel() {
        this.viewFilter ? this.viewFilter = false : this.viewFilter = true;
    }

    toggleOptionsPanel() {
        this.viewOptions ? this.viewOptions = false : this.viewOptions = true;
    }

    toggleStatusFilterOptions(status: string) {
        if (status === 'All') {
            this.statusFilterOptions = ['All'];
            this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
            return null;
        }
        if (this.statusFilterOptions.indexOf(status) === -1) {
            if (this.statusFilterOptions.indexOf('All') === 0) {
                this.statusFilterOptions = [];
            }
            this.statusFilterOptions.push(status);
            this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });

        } else {
            this.statusFilterOptions.splice(this.statusFilterOptions.indexOf(status), 1);
            this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
        }
    }

    togglePriorityFilterOptions(priority: string) {
        if (priority === 'All') {
            this.priorityFilterOptions = ['All'];
            this.currentUser.update({ priorityFilterOptions: this.priorityFilterOptions });
            return null;
        }
        if (this.priorityFilterOptions.indexOf(priority) === -1) {
            if (this.priorityFilterOptions.indexOf('All') === 0) {
                this.priorityFilterOptions = [];
            }
            this.priorityFilterOptions.push(priority);
            this.currentUser.update({ priorityFilterOptions: this.priorityFilterOptions });

        } else {
            this.priorityFilterOptions.splice(this.priorityFilterOptions.indexOf(priority), 1);
            this.currentUser.update({ priorityFilterOptions: this.priorityFilterOptions });

        }
    }

    toggleAssignedTechFilterOptions(tech: string) {
        if (tech === 'All') {
            this.assignedTechFilterOptions = ['All'];
            this.currentUser.update({ assignedTechFilterOptions: this.assignedTechFilterOptions });
            return null;
        }
        if (this.assignedTechFilterOptions.indexOf(tech) === -1) {
            if (this.assignedTechFilterOptions.indexOf('All') === 0) {
                this.assignedTechFilterOptions = [];
            }
            this.assignedTechFilterOptions.push(tech);
            this.currentUser.update({ assignedTechFilterOptions: this.assignedTechFilterOptions });
        } else {
            this.assignedTechFilterOptions.splice(this.assignedTechFilterOptions.indexOf(tech), 1);
            this.currentUser.update({ assignedTechFilterOptions: this.assignedTechFilterOptions });
        }
    }

    toggleListLimit(num: number) {
        this.listLimit = num;
        const currentPageNum = ('0000000' + (this.parseTicketNum(this.newestTicketId) - (this.listLimit - 1)).toString()).slice(-7);
        this.currentPageStart = ['HTR-', currentPageNum.slice(0, 3), '-', currentPageNum.slice(3)].join('');
        const nextPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) - this.listLimit).toString()).slice(-7);
        this.nextPageStart = ['HTR-', nextPageNum.slice(0, 3), '-', nextPageNum.slice(3)].join('');
        const prevPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) + this.listLimit).toString()).slice(-7);
        this.prevPageStart = ['HTR-', prevPageNum.slice(0, 3), '-', prevPageNum.slice(3)].join('');
        this.tickets = this.af.list('/tickets', {
            query: {
                orderByChild: 'id',
                limitToLast: this.listLimit
            }
        });
        this.prevBtnActive = false;
        this.nextBtnActive = true;
    }

    nextPage() {
        const nextEndNum = ('0000000' + (this.parseTicketNum(this.prevPageStart) - (this.listLimit + 1)).toString()).slice(-7);
        const nextPageEnd  = ['HTR-', nextEndNum.slice(0, 3), '-', nextEndNum.slice(3)].join('');
        this.tickets = this.af.list('/tickets', {
            query: {
                orderByChild: 'id',
                startAt: this.nextPageStart,
                endAt: nextPageEnd
            }
        });
        this.prevBtnActive = true;
        if (this.parseTicketNum(this.nextPageStart) > this.parseTicketNum(this.firstTicketId)) {
            this.prevPageStart = this.currentPageStart;
            this.currentPageStart = this.nextPageStart;
            if ((this.parseTicketNum(this.currentPageStart) - this.listLimit) >= this.parseTicketNum(this.firstTicketId)) {
                const nextStartNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) - this.listLimit).toString()).slice(-7);
                this.nextPageStart = ['HTR-', nextStartNum.slice(0, 3), '-', nextStartNum.slice(3)].join('');
            } else {
                this.nextPageStart = this.firstTicketId;
            }
        } else {
            this.nextBtnActive = false;
        }
    }

    prevPage() {
        const prevEndNum = ('0000000' + (this.parseTicketNum(this.prevPageStart) + (this.listLimit - 1)).toString()).slice(-7);
        const prevPageEnd = ['HTR-', prevEndNum.slice(0, 3), '-', prevEndNum.slice(3)].join('');
        this.tickets = this.af.list('/tickets', {
            query: {
                orderByChild: 'id',
                startAt: this.prevPageStart,
                endAt: prevPageEnd
            }
        });
        this.nextBtnActive = true;
        this.nextPageStart = this.currentPageStart;
        this.currentPageStart = this.prevPageStart;
        const prevStartNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) + this.listLimit).toString()).slice(-7);
        this.prevPageStart = ['HTR-', prevStartNum.slice(0, 3), '-', prevStartNum.slice(3)].join('');
        if (this.parseTicketNum(this.prevPageStart) >= this.parseTicketNum(this.newestTicketId)) {
            this.prevBtnActive = false;
        }
    }

    parseTicketNum(id: string) {
        return parseInt(id.slice(4).replace(/-/g, ''), 10);
    }

    ngOnInit() {
        
    }

    ngOnChanges() {
        
    }
}
