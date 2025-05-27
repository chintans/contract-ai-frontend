import { TestBed } from '@angular/core/testing';
import { VersionTimelineComponent } from './version-timeline.component';

describe('VersionTimelineComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionTimelineComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(VersionTimelineComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
