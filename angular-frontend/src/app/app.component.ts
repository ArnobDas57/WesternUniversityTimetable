import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result, Result2, Result3a, Result3b, Quantity, SavedSchedule } from './result';
import { Schedule, CourseList } from './schedule';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  quantity: any;
  newSchedule;
  courseList;
  savedSchedules: Observable<SavedSchedule[]>;

  ROOT_URL = '/api';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getResults() {
    this.results = this.http.get<Result[]>(this.ROOT_URL + '/courses');
    return this.results;
  }

  getResults2(subjectcode: string) {
    this.results2 = this.http.get<Result2[]>(this.ROOT_URL + `/courses/subjects/${subjectcode}`);
    return this.results2;
  }

  getResults3a(subjectcode: string, catalognum: string) {
    this.results3a = this.http.get<Result3a[]>(this.ROOT_URL + `/courses/subjects/${subjectcode}/${catalognum}`);
    return this.results3a;
  }

  getResults3b(subjectcode: string, catalognum: string, ssrcomponent: string) {
    this.results3b = this.http.get<Result3b[]>(this.ROOT_URL + `/courses/subjects/${subjectcode}/${catalognum}/${ssrcomponent}`);
    return this.results3b;
  }

  createSched(name: string, amount: number) {
   const data = {
     scheduleName: name
    }

   this.newSchedule = this.http.post(this.ROOT_URL + '/courses/schedules', data, this.httpOptions).toPromise().then(e => {
     console.log(e);
   }); 
   return amount;
  }

  AddCourses(courses: any, schedName: string) {
    this.http.put(this.ROOT_URL + `/courses/schedules/${schedName}`, courses, this.httpOptions).toPromise().then(e => {
      console.log(e);
    });
  }

  getSchedules(scheduleName: any) {
    this.savedSchedules = this.http.get<SavedSchedule[]>(this.ROOT_URL + `/courses/schedules/${scheduleName}`);
    return this.savedSchedules;
  }
}
     
     