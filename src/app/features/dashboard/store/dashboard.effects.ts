import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DashboardActions from './dashboard.actions';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DashboardDataService } from './dashboard-data.service';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dataService = inject(DashboardDataService);

  loadContracts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadContracts),
      mergeMap(() =>
        this.dataService.loadContracts().pipe(
          map(contracts => DashboardActions.loadContractsSuccess({ contracts })),
          catchError(error => of(DashboardActions.loadContractsFailure({ error: error.message || 'Failed to load contracts' })))
        )
      )
    )
  );

  loadClauses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadClauses),
      mergeMap(({ contractId }) =>
        this.dataService.loadClauses(contractId).pipe(
          map(clauses => DashboardActions.loadClausesSuccess({ clauses })),
          catchError(error => of(DashboardActions.loadClausesFailure({ error: error.message || 'Failed to load clauses' })))
        )
      )
    )
  );

  loadRiskFlags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadRiskFlags),
      mergeMap(({ contractId }) =>
        this.dataService.loadRiskFlags(contractId).pipe(
          map(riskFlags => DashboardActions.loadRiskFlagsSuccess({ riskFlags })),
          catchError(error => of(DashboardActions.loadRiskFlagsFailure({ error: error.message || 'Failed to load risk flags' })))
        )
      )
    )
  );

  loadCompliance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadCompliance),
      mergeMap(({ contractId }) =>
        this.dataService.loadCompliance(contractId).pipe(
          map(compliance => DashboardActions.loadComplianceSuccess({ compliance })),
          catchError(error => of(DashboardActions.loadComplianceFailure({ error: error.message || 'Failed to load compliance' })))
        )
      )
    )
  );

  loadChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadChat),
      mergeMap(({ contractId }) =>
        this.dataService.loadChat(contractId).pipe(
          map(messages => DashboardActions.loadChatSuccess({ messages })),
          catchError(error => of(DashboardActions.loadChatFailure({ error: error.message || 'Failed to load chat' })))
        )
      )
    )
  );

  loadUploadQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadUploadQueue),
      mergeMap(() =>
        this.dataService.loadUploadQueue().pipe(
          map(queue => DashboardActions.loadUploadQueueSuccess({ queue })),
          catchError(error => of(DashboardActions.loadUploadQueueFailure({ error: error.message || 'Failed to load upload queue' })))
        )
      )
    )
  );
} 