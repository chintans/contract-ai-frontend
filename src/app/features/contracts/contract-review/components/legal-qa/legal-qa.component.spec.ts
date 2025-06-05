import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LegalQAComponent } from './legal-qa.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FocusMonitor } from '@angular/cdk/a11y';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
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
      getAIResponse: vi.fn().mockResolvedValue('answer')
    };

    await TestBed.configureTestingModule({
      imports: [LegalQAComponent, NoopAnimationsModule],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        { provide: Router, useValue: { navigate: vi.fn() } },
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
