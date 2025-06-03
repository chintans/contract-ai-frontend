import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest'
import { ReviewJobListComponent } from './review-job-list.component';

describe('ReviewJobListComponent', () => {
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewJobListComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReviewJobListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
