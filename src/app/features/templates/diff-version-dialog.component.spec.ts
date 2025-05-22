import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiffVersionDialogComponent } from './diff-version-dialog.component';
import { TemplateVersion } from './template-version.model';

describe('DiffVersionDialogComponent', () => {
  let fixture: ComponentFixture<DiffVersionDialogComponent>;
  let component: DiffVersionDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffVersionDialogComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(DiffVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close when close button clicked', () => {
    const closeSpy = spyOn(component.close, 'emit');
    fixture.nativeElement.querySelector('button').click();
    expect(closeSpy).toHaveBeenCalled();
  });
});
