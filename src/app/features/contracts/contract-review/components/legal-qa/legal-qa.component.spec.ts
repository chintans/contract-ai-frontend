import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LegalQAComponent } from './legal-qa.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FocusMonitor } from '@angular/cdk/a11y';

class FocusMonitorStub {
  monitor() { return of(null); }
  stopMonitoring() {}
}

class AnnouncerStub {
  announce() {}
}

describe('LegalQAComponent', () => {
  let serviceSpy: jasmine.SpyObj<ContractAnalysisService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ContractAnalysisService', ['getCurrentAnalysis', 'getAIResponse']);
    serviceSpy.getCurrentAnalysis.and.returnValue(of({} as any));
    serviceSpy.getAIResponse.and.resolveTo('answer');

    await TestBed.configureTestingModule({
      imports: [LegalQAComponent],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: ActivatedRoute, useValue: {} },
        { provide: FocusMonitor, useClass: FocusMonitorStub },
        { provide: LiveAnnouncer, useClass: AnnouncerStub }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LegalQAComponent);
    const component = fixture.componentInstance;
    component.questionInput = { nativeElement: { focus() {} } } as any;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should send message', fakeAsync(() => {
    const fixture = TestBed.createComponent(LegalQAComponent);
    const component = fixture.componentInstance;
    component.questionInput = { nativeElement: { focus() {} } } as any;
    component.currentQuestion = 'test';
    component.sendMessage();
    tick();
    expect(serviceSpy.getAIResponse).toHaveBeenCalledWith('test');
    expect(component.messages.length).toBe(2);
  }));
});
