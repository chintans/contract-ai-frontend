/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { IngestDto } from '../models/IngestDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class HybridReviewService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public hybridReviewControllerIngestContract(
        requestBody: IngestDto,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/hybrid/ingest',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param q
     * @returns any
     * @throws ApiError
     */
    public hybridReviewControllerSearch(
        q: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/hybrid/search',
            query: {
                'q': q,
            },
        });
    }
}
