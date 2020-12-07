import { Component, OnInit } from '@angular/core';
import { Schedule } from '../schedule';
import { Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import firebase from 'firebase/app';


@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  private searchTerms = new Subject<string>();

  search(term: string): void {
    this.searchTerms.next(term);
  }

  schedules: any;
  
  constructor(private appcomponent: AppComponent, public auth: AngularFireAuth) { }

  getSchedules(scheduleName: string) {
    this.auth.currentUser.then((user) => {
      if (user) {
        user.getIdToken(true).then(token => {
            const email = user.email;            
            this.schedules = this.appcomponent.GetScheduleInfo(scheduleName, email, token);
      });
    } else {
      console.log("No user signed in");
    }
  });
  }

  ngOnInit(): void {}
}