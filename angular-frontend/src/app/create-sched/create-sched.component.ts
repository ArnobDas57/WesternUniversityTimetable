import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-create-sched',
  templateUrl: './create-sched.component.html',
  styleUrls: ['./create-sched.component.css']
})
export class CreateSchedComponent implements OnInit {
  private searchTerms = new Subject<string>();

  constructor(private appcomponent: AppComponent) { }

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

  add(schedName: string, amount: number) {
    this.quantity = [];
    this.num = this.appcomponent.createSched(schedName, amount);
    for(let i = 1; i <= this.num; i++) {
    this.quantity.push(i);
    }
  }

  addCourses(schedName: string) {
    for(let i = 0; i < this.quantity.length; i++)
    {
      this.Schedule[i] = {subject: this.SubjectList[i], catalog_nbr: this.CCList[i] } 
    }
    this.appcomponent.AddCourses(this.Schedule, schedName);
    this.SubjectList = [];
    this.CCList = [];
    this.Schedule = [];
  }
}
