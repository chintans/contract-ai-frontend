import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUnsavedEdits } from '../store/dashboard.selectors';
import { saveAllEdits, discardAllEdits } from '../store/dashboard.actions';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard-autosave-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-autosave-toolbar.component.html',
  styleUrls: ['./dashboard-autosave-toolbar.component.scss']
})
export class DashboardAutosaveToolbarComponent {
  private store = inject(Store);
  unsavedEdits$ = this.store.select(selectUnsavedEdits);
  unsavedCount$ = this.unsavedEdits$.pipe(map(edits => edits.length));

  saveAll() {
    this.store.dispatch(saveAllEdits());
  }

  discardAll() {
    this.store.dispatch(discardAllEdits());
  }
} 