import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardLeftRailComponent } from './components/dashboard-left-rail.component';
import { DashboardMainPanelComponent } from './components/dashboard-main-panel.component';
import { DashboardChatAssistantComponent } from './components/dashboard-chat-assistant.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from './store/dashboard.reducer';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        DashboardHeaderComponent,
        DashboardLeftRailComponent,
        DashboardMainPanelComponent,
        DashboardChatAssistantComponent
      ],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
