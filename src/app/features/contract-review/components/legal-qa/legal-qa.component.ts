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
  template: `
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <div *ngIf="analysis$ | async as analysis; else loading">
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Legal Q&A</h2>
              <p class="text-gray-600">{{ analysis.fileName }}</p>
            </div>
          </div>

          <mat-card>
            <mat-card-header>
              <mat-card-title>Legal Q&A Assistant</mat-card-title>
              <mat-card-subtitle>Ask questions about your contract</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="h-[400px] overflow-y-auto mb-4 p-4">
                <div *ngFor="let message of messages" class="mb-4">
                  <div [ngClass]="{
                    'flex items-start': true,
                    'justify-end': message.role === 'user',
                    'justify-start': message.role === 'assistant'
                  }">
                    <div [ngClass]="{
                      'max-w-[70%] rounded-lg p-3': true,
                      'bg-blue-100': message.role === 'user',
                      'bg-gray-100': message.role === 'assistant'
                    }">
                      <p class="text-sm">{{ message.content }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ message.timestamp | date:'short' }}
                      </p>
                    </div>
                  </div>
                </div>
                <div *ngIf="isLoading" class="flex justify-center my-4">
                  <mat-spinner diameter="30"></mat-spinner>
                </div>
              </div>
            </mat-card-content>
            <mat-divider></mat-divider>
            <div class="p-4">
              <form (ngSubmit)="sendMessage()" #qaForm="ngForm" class="flex gap-2">
                <mat-form-field appearance="outline" class="flex-grow">
                  <mat-label>Ask a question</mat-label>
                  <input matInput
                         [(ngModel)]="currentQuestion"
                         name="question"
                         placeholder="e.g., What are the key obligations?"
                         [disabled]="isLoading">
                </mat-form-field>
                <button mat-raised-button
                        color="primary"
                        type="submit"
                        [disabled]="!currentQuestion || isLoading">
                  <mat-icon>send</mat-icon>
                </button>
              </form>
            </div>
          </mat-card>

          <mat-card class="mt-6">
            <mat-card-header>
              <mat-card-title>Suggested Questions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="grid grid-cols-2 gap-4 p-4">
                <button mat-stroked-button
                        *ngFor="let question of suggestedQuestions"
                        (click)="askSuggestedQuestion(question)"
                        [disabled]="isLoading">
                  {{ question }}
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <div class="flex justify-end mt-6">
            <button mat-raised-button color="primary" (click)="goToSummary()">
              Back to Summary
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </div>

        <ng-template #loading>
          <div class="text-center py-12">
            <mat-spinner diameter="48" class="mx-auto mb-4"></mat-spinner>
            <p class="text-gray-600">Loading contract data...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    mat-form-field {
      width: 100%;
    }
  `]
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