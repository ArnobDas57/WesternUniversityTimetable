import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSchedComponent } from './create-sched.component';

describe('CreateSchedComponent', () => {
  let component: CreateSchedComponent;
  let fixture: ComponentFixture<CreateSchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSchedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
