import { TestBed } from '@angular/core/testing';
import { ContractEditorComponent } from './contract-editor.component';

describe('ContractEditorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractEditorComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractEditorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
