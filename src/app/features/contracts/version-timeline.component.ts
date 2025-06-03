import { Component } from '@angular/core';


interface VersionItem {
  id: string;
  versionNo: number;
  createdAt: string;
}

@Component({
  selector: 'app-version-timeline',
  standalone: true,
  imports: [],
  templateUrl: './version-timeline.component.html',
  styleUrls: ['./version-timeline.component.scss']
})
export class VersionTimelineComponent {
  versions: VersionItem[] = [
    { id: 'v1', versionNo: 1, createdAt: '2024-06-01' },
    { id: 'v2', versionNo: 2, createdAt: '2024-06-05' }
  ];
}
