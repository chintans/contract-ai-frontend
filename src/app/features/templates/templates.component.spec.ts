import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplatesComponent } from './templates.component';
import { Template } from './template-table.component';
import { TemplateTableComponent } from './template-table.component';

describe('TemplatesComponent', () => {
  let component: TemplatesComponent;
  let fixture: ComponentFixture<TemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesComponent, TemplateTableComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TemplatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 