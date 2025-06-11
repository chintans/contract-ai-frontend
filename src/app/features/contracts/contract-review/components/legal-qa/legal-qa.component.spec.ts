import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { LegalQAComponent } from './legal-qa.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FocusMonitor } from '@angular/cdk/a11y';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi, expect } from 'vitest';
import { QnAService } from '../../services/qna.service';

class FocusMonitorStub {
  monitor() { return of(null); }
  stopMonitoring() {}
}

class AnnouncerStub {
  announce() {}
}

describe('LegalQAComponent', () => {
  let serviceSpy: { getCurrentAnalysis: ReturnType<typeof vi.fn>; getAIResponse: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    serviceSpy = {
      getCurrentAnalysis: vi.fn().mockReturnValue(of({} as any)),
      getAIResponse: vi.fn().mockResolvedValue('test')
    };

    await TestBed.configureTestingModule({
      imports: [LegalQAComponent, NoopAnimationsModule],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: {} },
        { provide: FocusMonitor, useClass: FocusMonitorStub },
        { provide: LiveAnnouncer, useClass: AnnouncerStub },
        { provide: QnAService, useValue: { askQuestion: vi.fn().mockReturnValue(of({ answer: 'a', confidence: 1 })), disconnect: vi.fn() } }
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

  it('should send message', waitForAsync(async () => {
    const fixture = TestBed.createComponent(LegalQAComponent);
    const component = fixture.componentInstance;
    const qnaService = TestBed.inject(QnAService);
    component.questionInput = { nativeElement: { focus() {} } } as any;
    component.contractId = 'contract-123';
    component.currentQuestion = 'test';
    vi.spyOn(qnaService, 'askQuestion').mockReturnValue(of({ answer: 'answer', confidence: 1 }));
    await component.sendMessage();    
    expect(qnaService.askQuestion).toHaveBeenCalledWith('contract-123', 'test');
    expect(component.messages.length).toBe(2);
    expect(component.messages[0].role).toBe('user');
    expect(component.messages[1].role).toBe('assistant');
  }));
});
