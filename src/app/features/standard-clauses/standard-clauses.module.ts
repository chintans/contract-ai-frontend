import { NgModule, Provider, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { StandardClauseService } from './services/standard-clause.service';
import { MockStandardClauseService } from './services/mock-standard-clause.service';
import { IStandardClauseService } from './models/standard-clause.model';
import { StandardClausesRoutingModule } from './standard-clauses-routing.module';

export const STANDARD_CLAUSE_SERVICE_TOKEN = new InjectionToken<IStandardClauseService>('StandardClauseService');

const standardClauseProvider: Provider = environment.mockData
  ? { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: MockStandardClauseService }
  : { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: StandardClauseService };

@NgModule({
  imports: [CommonModule, StandardClausesRoutingModule],
  providers: [standardClauseProvider],
})
export class StandardClausesModule {} 