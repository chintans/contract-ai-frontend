import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { StandardClauseService } from '../../services/standard-clause.service';
import { MockStandardClauseService } from '../../services/mock-standard-clause.service';
import { StandardClausesRoutingModule } from './standard-clauses-routing.module';

const standardClauseProvider: Provider = environment.mockData
  ? { provide: StandardClauseService, useClass: MockStandardClauseService }
  : { provide: StandardClauseService, useClass: StandardClauseService };

@NgModule({
  imports: [CommonModule, StandardClausesRoutingModule],
  providers: [standardClauseProvider],
})
export class StandardClausesModule {} 