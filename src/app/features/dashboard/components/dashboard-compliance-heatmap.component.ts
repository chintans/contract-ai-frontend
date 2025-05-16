import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCompliance } from '../store/dashboard.selectors';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

interface HeatmapCell {
  status: 'pass' | 'warn' | 'fail';
  label: string;
}

@Component({
  selector: 'app-dashboard-compliance-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-compliance-heatmap.component.html',
  styleUrls: ['./dashboard-compliance-heatmap.component.scss']
})
export class DashboardComplianceHeatmapComponent {
  private store = inject(Store);
  compliance$ = this.store.select(selectCompliance);

  categories$ = this.compliance$.pipe(
    map(compliance => Array.from(new Set(compliance.map(c => c.category))))
  );
  rules$ = this.compliance$.pipe(
    map(compliance => Array.from(new Set(compliance.map(c => c.rule))))
  );
  matrix$ = this.compliance$.pipe(
    map(compliance => {
      const categories = Array.from(new Set(compliance.map(c => c.category)));
      const rules = Array.from(new Set(compliance.map(c => c.rule)));
      return categories.map(category =>
        rules.map(rule => {
          const cell = compliance.find(c => c.category === category && c.rule === rule);
          return cell ? { status: cell.status, label: cell.status === 'pass' ? '✔' : cell.status === 'warn' ? '!' : '✖' } : { status: 'fail', label: '✖' };
        })
      );
    })
  );
} 