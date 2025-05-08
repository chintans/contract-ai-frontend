import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ContractAnalysis {
  contractId: string;
  fileName: string;
  uploadDate: Date;
  status: 'analyzing' | 'completed' | 'error';
  analysis: {
    summary: {
      title: string;
      parties: string[];
      effectiveDate: Date;
      expirationDate: Date;
      value: number;
      keyTerms: { term: string; description: string }[];
      obligations: { party: string; obligations: string[] }[];
      recommendations: string[];
    };
    riskFlags: {
      id: string;
      type: 'high' | 'medium' | 'low';
      category: string;
      description: string;
      clause: string;
      recommendation: string;
      status: 'open' | 'resolved' | 'ignored';
      notes?: string;
    }[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContractAnalysisService {  
  private mockAnalysis: ContractAnalysis = {
    contractId: '123456',
    fileName: 'software-development-agreement.pdf',
    uploadDate: new Date(),
    status: 'completed',
    analysis: {
      summary: {
        title: 'Software Development Agreement',
        parties: ['TechCorp Inc.', 'DevServices LLC'],
        effectiveDate: new Date('2024-03-01'),
        expirationDate: new Date('2025-03-01'),
        value: 150000,
        keyTerms: [
          {
            term: 'Payment Terms',
            description: 'Monthly payments of $12,500 due on the 1st of each month'
          },
          {
            term: 'Deliverables',
            description: 'Custom software solution with specified features and milestones'
          }
        ],
        obligations: [
          {
            party: 'TechCorp Inc.',
            obligations: [
              'Provide detailed requirements',
              'Review and approve deliverables',
              'Make timely payments'
            ]
          },
          {
            party: 'DevServices LLC',
            obligations: [
              'Develop software according to specifications',
              'Meet project milestones',
              'Provide weekly progress reports'
            ]
          }
        ],
        recommendations: [
          'Consider adding specific performance metrics',
          'Include detailed acceptance criteria',
          'Review intellectual property rights section'
        ]
      },
      riskFlags: [
        {
          id: '1',
          type: 'high',
          category: 'Intellectual Property',
          description: 'IP ownership terms are ambiguous',
          clause: 'Section 8.2: Intellectual Property Rights',
          recommendation: 'Clearly specify IP ownership and transfer terms',
          status: 'open'
        },
        {
          id: '2',
          type: 'medium',
          category: 'Performance Metrics',
          description: 'Lack of specific performance criteria',
          clause: 'Section 4.1: Deliverables',
          recommendation: 'Add measurable performance metrics',
          status: 'open'
        }
      ]
    }
  };
  private currentAnalysis = new BehaviorSubject<ContractAnalysis | null>(this.mockAnalysis);
  getCurrentAnalysis(): Observable<ContractAnalysis | null> {
    return this.currentAnalysis.asObservable();
  }

  async uploadContract(file: File): Promise<void> {
    // Simulate file upload and analysis process
    this.currentAnalysis.next({
      ...this.mockAnalysis,
      fileName: file.name,
      uploadDate: new Date(),
      status: 'analyzing'
    });

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    this.currentAnalysis.next({
      ...this.mockAnalysis,
      fileName: file.name,
      uploadDate: new Date(),
      status: 'completed'
    });
  }

  updateRiskFlag(riskId: string, updates: Partial<ContractAnalysis['analysis']['riskFlags'][0]>): void {
    const currentValue = this.currentAnalysis.value;
    if (!currentValue) return;

    const updatedRiskFlags = currentValue.analysis.riskFlags.map(flag =>
      flag.id === riskId ? { ...flag, ...updates } : flag
    );

    this.currentAnalysis.next({
      ...currentValue,
      analysis: {
        ...currentValue.analysis,
        riskFlags: updatedRiskFlags
      }
    });
  }

  async getAIResponse(question: string): Promise<string> {
    // Mock AI response - In production, this would call your AI service
    const responses = {
      'risks': 'Based on the analysis, the main risks include unclear IP ownership terms and lack of specific performance metrics.',
      'termination': 'The contract can be terminated with 30 days written notice or immediately for material breach.',
      'payment': 'Payments are structured as monthly installments of $12,500 due on the 1st of each month.',
      'default': 'I\'ll analyze the contract and provide a detailed response to your question.'
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const questionLower = question.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (questionLower.includes(key)) {
        return response;
      }
    }

    return responses.default;
  }

  exportAnalysis(): Observable<Blob> {
    // Mock export functionality
    const analysis = this.currentAnalysis.value;
    if (!analysis) {
      throw new Error('No analysis available to export');
    }

    const exportData = JSON.stringify(analysis, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    
    // Simulate export delay
    return of(blob).pipe(delay(1000));
  }
} 