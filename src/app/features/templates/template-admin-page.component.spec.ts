import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateAdminPageComponent } from './template-admin-page.component';
import { Router } from '@angular/router';
import { Template } from './template-table.component';

describe('TemplateAdminPageComponent', () => {
  let component: TemplateAdminPageComponent;
  let fixture: ComponentFixture<TemplateAdminPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [TemplateAdminPageComponent],
      providers: [
        { provide: Router, useValue: spy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateAdminPageComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to new template on onNewTemplate', () => {
    component.onNewTemplate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/templates/new']);
  });

  it('should navigate to edit template on onEditTemplate', () => {
    const template: Template = { id: '123', name: 'Test', contractType: 'NDA', jurisdiction: { isGlobal: true }, activeVersion: '1.0' };
    component.onEditTemplate(template);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/templates', '123']);
  });
}); 