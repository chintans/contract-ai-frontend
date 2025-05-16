import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectChat } from '../store/dashboard.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-chat-assistant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-chat-assistant.component.html',
  styleUrls: ['./dashboard-chat-assistant.component.scss']
})
export class DashboardChatAssistantComponent {
  private store = inject(Store);
  chatMessages$ = this.store.select(selectChat);
} 