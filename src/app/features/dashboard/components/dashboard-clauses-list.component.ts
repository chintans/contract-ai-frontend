import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { selectClauses, selectFilters } from '../store/dashboard.selectors';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-dashboard-clauses-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './dashboard-clauses-list.component.html',
  styleUrls: ['./dashboard-clauses-list.component.scss']
})
export class DashboardClausesListComponent {
  private store = inject(Store);
  clauses$ = this.store.select(selectClauses);
  filters$ = this.store.select(selectFilters);

  filteredClauses$ = combineLatest([this.clauses$, this.filters$]).pipe(
    map(([clauses, filters]) =>
      clauses.filter(clause => {
        // Filter by clause type
        if (filters.clauseTypes.length && !filters.clauseTypes.includes(clause.type)) return false;
        // Filter by search string
        if (filters.search && !clause.body.toLowerCase().includes(filters.search.toLowerCase())) return false;
        // Add more filters as needed
        return true;
      })
    )
  );
} 