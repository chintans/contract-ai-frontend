import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clause-summary',
  template: `
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">Clause Summary</h2>
      <div class="space-y-4">
        <!-- Clause summary content will go here -->
      </div>
    </div>
  `
})
export class ClauseSummaryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
} 