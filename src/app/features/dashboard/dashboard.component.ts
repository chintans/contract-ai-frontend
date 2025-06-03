import { Component } from '@angular/core';

import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardLeftRailComponent } from './components/dashboard-left-rail.component';
import { DashboardMainPanelComponent } from './components/dashboard-main-panel.component';
import { DashboardChatAssistantComponent } from './components/dashboard-chat-assistant.component';

@Component({
  selector: 'app-dashboard',  
  imports: [
    DashboardHeaderComponent,
    DashboardLeftRailComponent,
    DashboardMainPanelComponent,
    DashboardChatAssistantComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {} 