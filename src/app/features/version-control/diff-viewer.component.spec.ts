import { TestBed } from '@angular/core/testing';
import { DiffViewerComponent } from './diff-viewer.component';

describe('DiffViewerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffViewerComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DiffViewerComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
