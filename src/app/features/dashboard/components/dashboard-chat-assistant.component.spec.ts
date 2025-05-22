import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardChatAssistantComponent } from './dashboard-chat-assistant.component';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardChatAssistantComponent', () => {
  let fixture: ComponentFixture<DashboardChatAssistantComponent>;
  let component: DashboardChatAssistantComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardChatAssistantComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardChatAssistantComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
