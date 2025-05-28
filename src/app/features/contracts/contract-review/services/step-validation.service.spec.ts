import { TestBed } from '@angular/core/testing';
import { StepValidationService } from './step-validation.service';

describe('StepValidationService', () => {
  let service: StepValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepValidationService);
  });

  it('should validate upload data', () => {
    const file = new File(['content'], 'test.txt');
    const result = service.validateUpload({ contractType: 'NDA', selectedFile: file });
    expect(result).toBeTrue();
  });

  it('should invalidate missing file', () => {
    const result = service.validateUpload({ contractType: 'NDA' } as any);
    expect(result).toBeFalse();
  });

  it('should validate QA data', () => {
    const result = service.validateQA({ questions: ['a', 'b'] });
    expect(result).toBeTrue();
  });

  it('should invalidate incorrect QA data', () => {
    const result = service.validateQA({ questions: 'bad' } as any);
    expect(result).toBeFalse();
  });
});
