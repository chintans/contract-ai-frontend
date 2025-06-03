import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest'
import { DashboardComparisonDrawerComponent } from './dashboard-comparison-drawer.component';

describe('DashboardComparisonDrawerComponent', () => {
  let fixture: ComponentFixture<DashboardComparisonDrawerComponent>;
  let component: DashboardComparisonDrawerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComparisonDrawerComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComparisonDrawerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBe(false);
  });
});
