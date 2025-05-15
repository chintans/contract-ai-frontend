import { InjectionToken } from '@angular/core';
import { IStandardClauseService } from './models/standard-clause.model';

export const STANDARD_CLAUSE_SERVICE_TOKEN = new InjectionToken<IStandardClauseService>('StandardClauseService'); 