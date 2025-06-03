import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest'
import { TemplateAdminPageComponent } from './template-admin-page.component';
import { provideRouter, Router } from '@angular/router';
import { Template } from './template-table.component';

describe('TemplateAdminPageComponent', () => {
  let component: TemplateAdminPageComponent;
  let fixture: ComponentFixture<TemplateAdminPageComponent>;
  let router: Router;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateAdminPageComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateAdminPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to new template on onNewTemplate', () => {
    component.onNewTemplate();
    const navigateSpy = vi.spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledWith(['/templates/new']);
  });

  it('should navigate to edit template on onEditTemplate', () => {
    const template: Template = { id: '123', name: 'Test', contractType: 'NDA', jurisdiction: { isGlobal: true }, activeVersion: '1.0' };
    component.onEditTemplate(template);
    const navigateSpy = vi.spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledWith(['/templates', '123']);
  });
}); 