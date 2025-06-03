import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StandardClauseFormDialogComponent } from './standard-clause-form-dialog.component';
import { CreateStandardClauseDto } from '../standard-clauses/models/standard-clause.model';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clauses/standard-clause-service.token';

const clause: CreateStandardClauseDto = {
  name: 'Test',
  type: 'TYPE',
  text: 'Body',
  jurisdiction: 'US',
  allowedDeviations: 0,
  contractType: 'NDA',
  version: '1.0'
};

describe('StandardClauseFormDialogComponent', () => {
  let fixture: ComponentFixture<StandardClauseFormDialogComponent>;
  let component: StandardClauseFormDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StandardClauseFormDialogComponent],
      providers: [{ provide: STANDARD_CLAUSE_SERVICE_TOKEN, useValue: {} }]
    }).compileComponents();
    fixture = TestBed.createComponent(StandardClauseFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit save on onSave', () => {
    const saveSpy = spyOn(component.save, 'emit');
    component.onSave(clause);
    expect(saveSpy).toHaveBeenCalledWith(clause);
  });

  it('should emit cancel on onCancel', () => {
    const cancelSpy = spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
