import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateVersionDrawerComponent } from './template-version-drawer.component';
import { TemplateVersion } from './template-version.model';

const versions: TemplateVersion[] = [
  { versionId: '1', templateId: 't1', versionNo: '1', createdAt: new Date(), createdBy: 'A', isActive: true, clauses: [] },
  { versionId: '2', templateId: 't1', versionNo: '2', createdAt: new Date(), createdBy: 'B', isActive: false, clauses: [] }
];

describe('TemplateVersionDrawerComponent', () => {
  let fixture: ComponentFixture<TemplateVersionDrawerComponent>;
  let component: TemplateVersionDrawerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateVersionDrawerComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateVersionDrawerComponent);
    component = fixture.componentInstance;
    component.versions = versions;
    component.open = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit activateVersion', () => {
    const spy = spyOn(component.activateVersion, 'emit');
    fixture.nativeElement.querySelector('button.text-green-600:not([disabled])').click();
    expect(spy).toHaveBeenCalledWith('2');
  });

  it('should emit compareVersion', () => {
    const spy = spyOn(component.compareVersion, 'emit');
    fixture.nativeElement.querySelector('button.text-blue-600').click();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should emit close on overlay click', () => {
    const spy = spyOn(component.close, 'emit');
    fixture.nativeElement.querySelector('div.flex-1').click();
    expect(spy).toHaveBeenCalled();
  });
});
