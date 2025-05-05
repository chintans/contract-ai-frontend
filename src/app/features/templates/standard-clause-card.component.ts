import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StandardClauseCardData {
  id: string;
  name: string;
  type: string;
  text: string;
  jurisdiction: string;
  allowedDeviations: number;
  version: string;
}

@Component({
  selector: 'app-standard-clause-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border rounded-lg shadow-sm bg-white mb-4">
      <div class="p-4 cursor-pointer" (click)="toggleExpand()">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">{{ clause.name }}</h3>
            <div class="text-sm text-gray-600">{{ clause.type }}</div>
          </div>
          <button class="text-gray-500">
            <svg [class.rotate-180]="isExpanded" class="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div *ngIf="isExpanded" class="px-4 pb-4 border-t">
        <div class="mt-3 space-y-2">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">Jurisdiction:</span>
              <span class="ml-2">{{ clause.jurisdiction }}</span>
            </div>
            <div>
              <span class="font-medium">Version:</span>
              <span class="ml-2">{{ clause.version }}</span>
            </div>
            <div>
              <span class="font-medium">Allowed Deviations:</span>
              <span class="ml-2">{{ clause.allowedDeviations }}%</span>
            </div>
          </div>
          <div class="mt-4">
            <div class="font-medium mb-2">Clause Text:</div>
            <div class="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{{ clause.text }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StandardClauseCardComponent {
  @Input({ required: true }) clause!: StandardClauseCardData;
  isExpanded = false;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
} 