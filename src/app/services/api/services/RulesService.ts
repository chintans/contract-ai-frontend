/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { CreateRuleDto } from '../models/CreateRuleDto';
import type { Rule } from '../models/Rule';
import type { UpdateRuleDto } from '../models/UpdateRuleDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class RulesService {
    constructor(public readonly http: HttpClient) {}
    /**
     * List rules
     * @returns Rule
     * @throws ApiError
     */
    public rulesControllerFindAll(): Observable<Array<Rule>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/rules',
        });
    }
    /**
     * Create rule
     * @param requestBody
     * @returns Rule
     * @throws ApiError
     */
    public rulesControllerCreate(
        requestBody: CreateRuleDto,
    ): Observable<Rule> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/rules',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed. Possible reasons: similarityThreshold and deviationAllowedPct both set, or pattern is not a valid regex.`,
            },
        });
    }
    /**
     * Get rule by id
     * @param id
     * @returns Rule
     * @throws ApiError
     */
    public rulesControllerFindOne(
        id: string,
    ): Observable<Rule> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/rules/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Rule not found`,
            },
        });
    }
    /**
     * Update rule
     * @param id
     * @param requestBody
     * @returns Rule
     * @throws ApiError
     */
    public rulesControllerUpdate(
        id: string,
        requestBody: UpdateRuleDto,
    ): Observable<Rule> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/rules/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed. Possible reasons: similarityThreshold and deviationAllowedPct both set, or pattern is not a valid regex.`,
            },
        });
    }
    /**
     * Delete rule
     * @param id
     * @returns any
     * @throws ApiError
     */
    public rulesControllerRemove(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/rules/{id}',
            path: {
                'id': id,
            },
        });
    }
}
