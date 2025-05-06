import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TemplateTableComponent, Template } from './template-table.component';
import { ComponentFixture } from '@angular/core/testing';

describe('TemplateTableComponent', () => {
  let fixture: ComponentFixture<TemplateTableComponent>;
  let component: TemplateTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateTableComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(!!component).toBe(true);
  });

  it('should show loading initially', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent && compiled.textContent.includes('Loading...')).toBe(true);
  });

  it('should render table after loading', fakeAsync(() => {
    fixture.detectChanges();
    tick(600); // simulate setTimeout
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(!!compiled.querySelector('table')).toBe(true);
  }));
}); 