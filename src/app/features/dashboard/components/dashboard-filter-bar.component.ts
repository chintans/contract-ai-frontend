import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectFilters } from '../store/dashboard.selectors';
import { setFilters } from '../store/dashboard.actions';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-filter-bar.component.html',
  styleUrls: ['./dashboard-filter-bar.component.scss']
})
export class DashboardFilterBarComponent {
  private store = inject(Store);
  filters$ = this.store.select(selectFilters);

  severities: FilterOption[] = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];
  clauseTypes: FilterOption[] = [
    { label: 'NDA', value: 'nda' },
    { label: 'Service', value: 'service' },
    { label: 'Employment', value: 'employment' }
  ];
  ruleCategories: FilterOption[] = [
    { label: 'Compliance', value: 'compliance' },
    { label: 'Risk', value: 'risk' },
    { label: 'Performance', value: 'performance' }
  ];
  reviewers: FilterOption[] = [
    { label: 'Alice', value: 'alice' },
    { label: 'Bob', value: 'bob' },
    { label: 'Carol', value: 'carol' }
  ];
  resolvedStates: FilterOption[] = [
    { label: 'Resolved', value: 'resolved' },
    { label: 'Unresolved', value: 'unresolved' }
  ];

  onFilterChange(partial: Partial<{ severities: string[]; clauseTypes: string[]; ruleCategories: string[]; reviewers: string[]; resolvedStates: string[]; search: string }>) {
    this.store.dispatch(setFilters({ filters: partial }));
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.onFilterChange({ search: target?.value ?? '' });
  }

  toggle(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
  }
} 