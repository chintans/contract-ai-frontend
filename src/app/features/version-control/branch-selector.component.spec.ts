import { TestBed } from '@angular/core/testing';
import { BranchSelectorComponent } from './branch-selector.component';

describe('BranchSelectorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchSelectorComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BranchSelectorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
