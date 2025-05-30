import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StandardClause, CreateStandardClauseDto, IStandardClauseService } from '../models/standard-clause.model';
import { StandardClausesService } from '../../../services/api/standardClauses.service';
import { StandardClauseDto } from '../../../services/model/standardClauseDto';

@Injectable({
  providedIn: 'root'
})
export class StandardClauseService implements IStandardClauseService {
  constructor(private api: StandardClausesService) {}

  private mapDto(dto: StandardClauseDto): StandardClause {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    } as StandardClause;
  }

  getAll(): Observable<StandardClause[]> {
    if (environment.mockData) {
      return this.api.standardClausesControllerFindAll().pipe(map(dtos => dtos.map(d => this.mapDto(d))));
    }
    return this.api.standardClausesControllerFindAll().pipe(map(dtos => dtos.map(d => this.mapDto(d))));
  }

  getOne(id: number): Observable<StandardClause> {
    return this.api.standardClausesControllerFindOne(id.toString()).pipe(map(this.mapDto.bind(this)));
  }

  getByType(type: string): Observable<StandardClause[]> {
    return this.api.standardClausesControllerFindAll().pipe(
      map(dtos => dtos.filter(dto => dto.type === type).map(d => this.mapDto(d)))
    );
  }

  getByContractType(contractType: string): Observable<StandardClause[]> {
    return this.api.standardClausesControllerFindByContractType(contractType).pipe(
      map(dtos => dtos.map(d => this.mapDto(d)))
    );
  }

  create(clause: CreateStandardClauseDto): Observable<StandardClause> {
    return this.api.standardClausesControllerCreate(clause).pipe(map(this.mapDto.bind(this)));
  }

  update(id: number, clause: Partial<CreateStandardClauseDto>): Observable<StandardClause> {
    return this.api.standardClausesControllerUpdate(id.toString(), clause).pipe(map(this.mapDto.bind(this)));
  }

  delete(id: number): Observable<void> {
    return this.api.standardClausesControllerRemove(id.toString());
  }
}
