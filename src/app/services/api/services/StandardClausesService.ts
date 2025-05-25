/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { CreateStandardClauseDto } from '../models/CreateStandardClauseDto';
import type { StandardClause } from '../models/StandardClause';
import type { UpdateStandardClauseDto } from '../models/UpdateStandardClauseDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class StandardClausesService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Create a new standard clause
     * @param requestBody
     * @returns StandardClause The standard clause has been successfully created.
     * @throws ApiError
     */
    public standardClausesControllerCreate(
        requestBody: CreateStandardClauseDto,
    ): Observable<StandardClause> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/standard-clauses',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all standard clauses
     * @returns StandardClause Return all standard clauses.
     * @throws ApiError
     */
    public standardClausesControllerFindAll(): Observable<Array<StandardClause>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/standard-clauses',
        });
    }
    /**
     * Get a standard clause by id
     * @param id
     * @returns StandardClause Return the standard clause.
     * @throws ApiError
     */
    public standardClausesControllerFindOne(
        id: string,
    ): Observable<StandardClause> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/standard-clauses/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Standard clause not found.`,
            },
        });
    }
    /**
     * Update a standard clause
     * @param id
     * @param requestBody
     * @returns StandardClause The standard clause has been successfully updated.
     * @throws ApiError
     */
    public standardClausesControllerUpdate(
        id: string,
        requestBody: UpdateStandardClauseDto,
    ): Observable<StandardClause> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/standard-clauses/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Standard clause not found.`,
            },
        });
    }
    /**
     * Delete a standard clause
     * @param id
     * @returns any The standard clause has been successfully deleted.
     * @throws ApiError
     */
    public standardClausesControllerRemove(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/standard-clauses/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Standard clause not found.`,
            },
        });
    }
    /**
     * Get standard clauses by type
     * @param type
     * @returns StandardClause Return the standard clauses of specified type.
     * @throws ApiError
     */
    public standardClausesControllerFindByType(
        type: string,
    ): Observable<Array<StandardClause>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/standard-clauses/type/{type}',
            path: {
                'type': type,
            },
        });
    }
    /**
     * Get standard clauses by contract type
     * @param contractType
     * @returns StandardClause Return clauses for the contract type.
     * @throws ApiError
     */
    public standardClausesControllerFindByContractType(
        contractType: string,
    ): Observable<Array<StandardClause>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/standard-clauses/contract-type/{contractType}',
            path: {
                'contractType': contractType,
            },
        });
    }
}
