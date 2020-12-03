import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseAppComponent } from './firebase-app.component';

describe('FirebaseAppComponent', () => {
  let component: FirebaseAppComponent;
  let fixture: ComponentFixture<FirebaseAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirebaseAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
