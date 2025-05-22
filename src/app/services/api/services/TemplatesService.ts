/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { CreateStandardClauseDto } from '../models/CreateStandardClauseDto';
import type { UpdateStandardClauseDto } from '../models/UpdateStandardClauseDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class TemplatesService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public templatesControllerCreate(
        requestBody: CreateStandardClauseDto,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/templates',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public templatesControllerFindAll(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/templates',
        });
    }
    /**
     * @param type
     * @returns any
     * @throws ApiError
     */
    public templatesControllerFindByType(
        type: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/templates/type/{type}',
            path: {
                'type': type,
            },
        });
    }
    /**
     * @param jurisdiction
     * @returns any
     * @throws ApiError
     */
    public templatesControllerFindByJurisdiction(
        jurisdiction: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/templates/jurisdiction/{jurisdiction}',
            path: {
                'jurisdiction': jurisdiction,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public templatesControllerFindOne(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/templates/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public templatesControllerUpdate(
        id: string,
        requestBody: UpdateStandardClauseDto,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/templates/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public templatesControllerRemove(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/templates/{id}',
            path: {
                'id': id,
            },
        });
    }
}
