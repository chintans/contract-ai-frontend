import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractAnalysisService, ContractAnalysis } from '../../services/contract-analysis.service';
import { Observable } from 'rxjs';

interface QAMessage {
  role: 'user' | 'assistant';
  content: string;
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
export class LegalQAComponent implements OnInit {
  analysis$: Observable<ContractAnalysis | null>;
  messages: QAMessage[] = [];
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

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private router: Router
  ) {
    this.analysis$ = this.contractAnalysisService.getCurrentAnalysis();
  }

  ngOnInit(): void {
    // Subscribe to check if analysis exists
    this.analysis$.subscribe(analysis => {
      if (!analysis) {
        // If no analysis is available, redirect to upload
        this.router.navigate(['contract-review', 'upload']);
      } else {
        // Add welcome message
        this.addMessage({
          role: 'assistant',
          content: 'Hello! I\'m your legal assistant. How can I help you understand your contract better?',
          timestamp: new Date()
        });
      }
    });
  }

  async sendMessage(): Promise<void> {
    if (!this.currentQuestion.trim()) return;

    const userQuestion = this.currentQuestion;
    this.addMessage({
      role: 'user',
      content: userQuestion,
      timestamp: new Date()
    });

    this.currentQuestion = '';
    this.isLoading = true;

    try {
      const response = await this.contractAnalysisService.getAIResponse(userQuestion);
      this.addMessage({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      this.addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
    }
  }

  askSuggestedQuestion(question: string): void {
    this.currentQuestion = question;
    this.sendMessage();
  }

  private addMessage(message: QAMessage): void {
    this.messages.push(message);
    // Scroll to bottom after message is added
    setTimeout(() => {
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }

  goToSummary(): void {
    this.router.navigate(['contract-review', 'summary']);
  }
} 