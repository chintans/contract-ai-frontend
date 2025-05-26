import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractAnalysisService, ContractAnalysis } from '../../services/contract-analysis.service';
import { QnAService } from '../../services/qna.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FocusMonitor, LiveAnnouncer } from '@angular/cdk/a11y';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'app-legal-qa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './legal-qa.component.html',
  styleUrls: ['./legal-qa.component.scss']
})
export class LegalQAComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('qaForm') qaForm!: NgForm;
  @ViewChild('questionInput') questionInput!: ElementRef;
  @Input() contractId: string | null = null;

  analysis$: Observable<ContractAnalysis | null>;
  messages: Message[] = [];
  currentQuestion = '';
  isLoading = false;
  suggestedQuestions = [
    'What are the main risks in this contract?',
    'What are the termination conditions?',
    'Are there any unusual clauses?',
    'What are the payment terms?',
    'What are the confidentiality obligations?',
    'What is the governing law?'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private qnaService: QnAService,
    private router: Router,
    private route: ActivatedRoute,
    private focusMonitor: FocusMonitor,
    private liveAnnouncer: LiveAnnouncer
  ) {
    this.analysis$ = this.contractAnalysisService.getCurrentAnalysis();
  }

  ngOnInit(): void {
    // Subscribe to check if analysis exists
    this.analysis$.subscribe(analysis => {
      if (!analysis) {
        // If no analysis is available, redirect to upload
        this.router.navigate(['../upload'], { relativeTo: this.route });
      } else {
        // Add welcome message
        this.addMessage({
          role: 'assistant',
          content: 'Hello! I\'m your legal assistant. How can I help you understand your contract better?',
          timestamp: new Date()
        });
      }
    });

    // Subscribe to form value changes for accessibility announcements
    this.qaForm?.valueChanges?.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.isLoading) {
        this.liveAnnouncer.announce('Processing your question...');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contractId'] && this.contractId) {
      this.fetchQnA(this.contractId);
    }
  }

  ngAfterViewInit(): void {
    // Monitor focus on the question input
    if (this.questionInput) {
      this.focusMonitor.monitor(this.questionInput)
        .pipe(takeUntil(this.destroy$))
        .subscribe(origin => {
          if (origin === 'keyboard') {
            this.liveAnnouncer.announce('Question input field. Type your question and press Enter to send.');
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.questionInput) {
      this.focusMonitor.stopMonitoring(this.questionInput);
    }
    this.qnaService.disconnect();
  }

  async sendMessage(): Promise<void> {
    if (!this.currentQuestion.trim() || this.isLoading) {
      return;
    }
    if (!this.contractId) {
      this.addMessage({
        role: 'assistant',
        content: 'No contract selected. Please upload a contract first.',
        timestamp: new Date()
      });
      return;
    }
    this.isLoading = true;
    this.liveAnnouncer.announce('Sending your question...');
    const userQuestion = this.currentQuestion;
    this.addMessage({
      role: 'user',
      content: userQuestion,
      timestamp: new Date()
    });
    this.qnaService.askQuestion(this.contractId, userQuestion).subscribe({
      next: (data) => {
        this.addMessage({
          role: 'assistant',
          content: data.answer,
          timestamp: new Date()
        });
        this.liveAnnouncer.announce('Response received');
      },
      error: (err) => {
        this.addMessage({
          role: 'assistant',
          content: err?.message || 'I apologize, but I encountered an error processing your question. Please try again.',
          timestamp: new Date()
        });
        this.liveAnnouncer.announce('Error sending message. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
        this.currentQuestion = '';
        // Return focus to input after sending
        this.questionInput.nativeElement.focus();
      }
    });
  }

  async askSuggestedQuestion(question: string): Promise<void> {
    this.currentQuestion = question;
    await this.sendMessage();
  }

  // Handle keyboard events for better accessibility
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addMessage(message: Message): void {
    this.messages.push(message);
    // Scroll to bottom after message is added
    setTimeout(() => {
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }

  private async fetchQnA(contractId: string): Promise<void> {
    try {
      const qnaRes = await this.contractAnalysisService['contractsService'].contractControllerGetContractQnA(contractId).toPromise();
      if (Array.isArray(qnaRes)) {
        this.messages = qnaRes.map((item: any) => ({
          content: item.content,
          role: item.role === 'user' ? 'user' : 'assistant',
          timestamp: item.timestamp ? new Date(item.timestamp) : new Date()
        }));
      }
    } catch (error) {
      // Optionally handle error
    }
  }
} 