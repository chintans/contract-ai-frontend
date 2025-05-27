import { TestBed } from '@angular/core/testing';
import { CommitDialogComponent } from './commit-dialog.component';

describe('CommitDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitDialogComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CommitDialogComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
