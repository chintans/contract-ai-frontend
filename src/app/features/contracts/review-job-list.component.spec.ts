import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReviewJobListComponent } from './review-job-list.component';

describe('ReviewJobListComponent', () => {
  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [ReviewJobListComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReviewJobListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
