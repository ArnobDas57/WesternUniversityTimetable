import { Component, OnInit } from '@angular/core';
import { Schedule } from '../schedule';
import { Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';


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
  
  constructor(private appcomponent: AppComponent) { }

  getSchedules(scheduleName: string) {
    this.schedules = this.appcomponent.getSchedules(scheduleName);
  }

  ngOnInit(): void {}
}
