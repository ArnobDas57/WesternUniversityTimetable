import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result, Result2, Result3a, Result3b, Result4, Result5, Quantity, SavedSchedule } from './result';
import { Schedule, CourseList } from './schedule';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Western Undergraduate Timetable ';

  results: Observable<Result[]>;
  results2: Observable<Result2[]>;
  results3a: Observable<Result3a[]>;
  results3b: Observable<Result3b[]>;
  results4: Observable<Result4[]>;
  kwResults: Observable<Result5[]>;
  quantity: any;
  newSchedule;
  courseList;
  savedSchedules: Observable<SavedSchedule[]>;
  allSchedules: Observable<SavedSchedule[]>;

  ROOT_URL = '/api';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  keywordSearch(keyword: string) {
    this.kwResults = this.http.get<Result5[]>(this.ROOT_URL + `/open/courses/subjects/keywords/${keyword}`);
    return this.kwResults;
  }

  getResults() {
    this.results = this.http.get<Result[]>(this.ROOT_URL + '/open/courses');
    return this.results;
  }

  getResults2(subjectcode: string) {
    this.results2 = this.http.get<Result2[]>(this.ROOT_URL + `/open/courses/subjects/${subjectcode}`);
    return this.results2;
  }

  getResults3a(subjectcode: string, catalognum: string) {
    this.results3a = this.http.get<Result3a[]>(this.ROOT_URL + `/open/courses/subjects/${subjectcode}/${catalognum}`);
    return this.results3a;
  }

  getResults3b(subjectcode: string, catalognum: string, ssrcomponent: string) {
    this.results3b = this.http.get<Result3b[]>(this.ROOT_URL + `/open/courses/subjects/${subjectcode}/${catalognum}/${ssrcomponent}`);
    return this.results3b;
  }

  getResults4(catalognum: string) {
    this.results4 = this.http.get<Result4[]>(this.ROOT_URL + `/open/courses/subjects/numberAndComponent/${catalognum}`);
    return this.results4;
  }

  createSched(name: string, amount: number, desc: string, vis: string, email: string, token: any) {
   const data = {
     scheduleName: name,
     optionalDescription: desc,
     visibility: vis
    }

    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token})
    };

    this.newSchedule = this.http.post(this.ROOT_URL + `/secure/courses/users/${email}/schedules`, data, this.httpOptions).toPromise().then(e => {
     console.log(e);
   }); 
   return amount;
  }

  AddCourses(courses: any, schedName: string, email: string, token: any) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token})
    };

    this.http.put(this.ROOT_URL + `/secure/courses/users/${email}/schedules/${schedName}`, courses, this.httpOptions).toPromise().then(e => {
      console.log(e);
    });
  }

  GetScheduleInfo(schedName: string, email: string, token: any) {
    this.httpOptions = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + token})
    };

    this.savedSchedules = this.http.get<SavedSchedule[]>(this.ROOT_URL + `/secure/courses/users/${email}/schedules/${schedName}`, this.httpOptions)
    return this.savedSchedules;
  }

  DeleteSchedule(schedName: string, email: string, token: any) {
    this.httpOptions = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + token})
    };

    this.http.delete(this.ROOT_URL + `/secure/courses/users/${email}/schedules/${schedName}`, this.httpOptions).toPromise().then(e => {
      console.log(e);
    }); 
  }

  GetUserSchedules(email: string, token: any) {
  this.httpOptions = {
    headers: new HttpHeaders({'Authorization': 'Bearer ' + token})
  };

  this.allSchedules = this.http.get<SavedSchedule[]>(this.ROOT_URL + `/secure/courses/users/${email}/schedules`, this.httpOptions)
  return this.allSchedules;
  }
}