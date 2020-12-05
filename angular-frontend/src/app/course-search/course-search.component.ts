import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.css']
})
export class CourseSearchComponent implements OnInit {

  constructor(private appcomponent: AppComponent) { }

  ngOnInit(): void {}

  private searchTerms = new Subject<string>();

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  results: any;
  results2: any;
  results3a: any;
  results3b: any;
  results4: any;
  kwResults: any;
  temp = false;
  
  keywordSearch(keyword: string) {
    this.results = '';
    this.results2 = '';
    this.results3a = '';
    this.results3b = '';
    this.results4 = '';

    if(((keyword.trim()).replace(/\s/g, '')).length >= 4)
    {
      this.kwResults = this.appcomponent.keywordSearch(((keyword.trim()).replace(/\s/g, '')));
    }
  }

  getResults() {
    this.results = this.appcomponent.getResults();
    this.results2 = '';
    this.results3a = '';
    this.results3b = '';
    this.results4 = '';
  }

  getResults2(subjectcode: string) {
    this.results2 = this.appcomponent.getResults2(subjectcode);
    this.results = '';
    this.results3a = '';
    this.results3b = '';
    this.results4 = '';
  }

  getResults3a(subjectcode: string, catalognum: string) {
    this.results3a = this.appcomponent.getResults3a(subjectcode, catalognum);
    this.results2 = '';
    this.results = '';
    this.results3b = '';
    this.results4 = '';
  }

  getResults3b(subjectcode: string, catalognum: string, ssrcomponent: string) {
    this.results3b = this.appcomponent.getResults3b(subjectcode, catalognum, ssrcomponent);
    this.results2 = '';
    this.results3a = '';
    this.results = '';
    this.results4 = '';
  } 

  getResults4(catalognum: string) {
    this.results4 = this.appcomponent.getResults4(catalognum);
    this.results2 = '';
    this.results3a = '';
    this.results = '';
    this.results3b = '';
  } 

  expand()
  {
    this.temp = true;
  }

  condense()
  {
    this.temp = false;
  }
}