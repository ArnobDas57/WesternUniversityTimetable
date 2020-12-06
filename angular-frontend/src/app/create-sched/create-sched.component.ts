import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-create-sched',
  templateUrl: './create-sched.component.html',
  styleUrls: ['./create-sched.component.css']
})
export class CreateSchedComponent implements OnInit {
  private searchTerms = new Subject<string>();

  constructor(private appcomponent: AppComponent, public auth: AngularFireAuth, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  num;
  quantity;
  SubjectList = [];
  CCList = [];
  Schedule = [];

  add(schedName: string, amount: number, desc: string, vis: string) {
    this.auth.currentUser.then((user) => {
      if (user) {
        user.getIdToken(true).then(token => {

          this.quantity = [];
          for(let i = 1; i <= this.num; i++) 
          {
            this.quantity.push(i);
          }
          
          this.num = this.appcomponent.createSched(schedName, amount, desc, vis, token);
      });
      } else {
        console.log("No user signed in");
      }
    });
  }

  addCourses(schedName: string) {
    this.auth.currentUser.then((user) => {
      if (user) {
        user.getIdToken(true).then(token => {
            const email = user.email;            

            for(let i = 0; i < this.quantity.length; i++)
            {
              this.Schedule[i] = {subject: this.SubjectList[i], catalog_nbr: this.CCList[i] } 
            }
            this.appcomponent.AddCourses(this.Schedule, schedName, token);
            this.SubjectList = [];
            this.CCList = [];
            this.Schedule = [];
            
      });
    } else {
      console.log("No user signed in");
    }
  });
}








}