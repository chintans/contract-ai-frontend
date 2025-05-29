import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { dashboardReducer } from './store/dashboard.reducer';
import { DashboardEffects } from './store/dashboard.effects';
import { DashboardDataService, DashboardMockDataService, DashboardApiDataService } from './store/dashboard-data.service';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardComponent,
    StoreModule.forFeature('dashboard', dashboardReducer),
    EffectsModule.forFeature([DashboardEffects])
  ],
  providers: [
    {
      provide: DashboardDataService,
      useClass: environment.mockData ? DashboardMockDataService : DashboardApiDataService
    }
  ],
  exports: [RouterModule]
})
export class DashboardModule { } 