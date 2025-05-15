import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { StandardClauseService } from './services/standard-clause.service';
import { MockStandardClauseService } from './services/mock-standard-clause.service';
import { StandardClausesRoutingModule } from './standard-clauses-routing.module';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from './standard-clause-service.token';

const standardClauseProvider: Provider = environment.mockData
  ? { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: MockStandardClauseService }
  : { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: StandardClauseService };

@NgModule({
  imports: [CommonModule, StandardClausesRoutingModule],
  providers: [standardClauseProvider],
})
export class StandardClausesModule {} 