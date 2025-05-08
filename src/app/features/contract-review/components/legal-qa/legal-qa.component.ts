import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class LegalQAComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('qaForm') qaForm!: NgForm;
  @ViewChild('questionInput') questionInput!: ElementRef;

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
  }

  async sendMessage(): Promise<void> {
    if (!this.currentQuestion.trim() || this.isLoading) {
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

    try {
      const response = await this.contractAnalysisService.getAIResponse(userQuestion);
      this.addMessage({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });
      this.liveAnnouncer.announce('Response received');
    } catch (error) {
      console.error('Error getting AI response:', error);
      this.addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      });
      this.liveAnnouncer.announce('Error sending message. Please try again.');
    } finally {
      this.isLoading = false;
      this.currentQuestion = '';
      // Return focus to input after sending
      this.questionInput.nativeElement.focus();
    }
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
} 