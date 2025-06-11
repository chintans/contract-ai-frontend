import { TestBed } from '@angular/core/testing';
import { ContractUploadComponent } from './contract-upload.component';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http';

describe('ContractUploadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractUploadComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractUploadComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should emit data on contract type change', () => {
    const fixture = TestBed.createComponent(ContractUploadComponent);
    const component = fixture.componentInstance;
    const spy = vi.spyOn(component.uploadDataChange, 'emit');
    component.contractType = 'service';
    component.onContractTypeChange();
    expect(spy).toHaveBeenCalledWith({ contractType: 'service', selectedFile: null });
  });

  it('should format file size', () => {
    const fixture = TestBed.createComponent(ContractUploadComponent);
    const component = fixture.componentInstance;
    expect(component.formatFileSize(1024)).toBe('1 KB');
  });
});
