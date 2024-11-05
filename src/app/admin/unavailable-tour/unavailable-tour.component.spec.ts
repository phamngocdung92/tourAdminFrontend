import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailableTourComponent } from './unavailable-tour.component';

describe('UnavailableTourComponent', () => {
  let component: UnavailableTourComponent;
  let fixture: ComponentFixture<UnavailableTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnavailableTourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnavailableTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
