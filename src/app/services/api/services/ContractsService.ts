/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { IngestContractDto } from '../models/IngestContractDto';
import type { UpdateContractDto } from '../models/UpdateContractDto';
import type { UpdateRiskFlagDto } from '../models/UpdateRiskFlagDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class ContractsService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Upload a contract file
     * @param formData
     * @returns any
     * @throws ApiError
     */
    public contractControllerCreate(
        formData: {
            file?: Blob;
            contractType?: string;
        },
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/contracts/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Get all contracts
     * @returns any Return all contracts
     * @throws ApiError
     */
    public contractControllerFindAll(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts',
        });
    }
    /**
     * Get a contract by id
     * @param id
     * @returns any Return the contract
     * @throws ApiError
     */
    public contractControllerFindOne(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a contract
     * @param id
     * @param requestBody
     * @returns any Contract updated successfully
     * @throws ApiError
     */
    public contractControllerUpdate(
        id: string,
        requestBody: UpdateContractDto,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/contracts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a contract
     * @param id
     * @returns any Contract deleted successfully
     * @throws ApiError
     */
    public contractControllerRemove(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/contracts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Analyze a contract using AI
     * @param id
     * @returns any Contract analysis completed
     * @throws ApiError
     */
    public contractControllerAnalyzeContract(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/contracts/{id}/analyze',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get contract summaries
     * @param id
     * @returns any Return contract summaries
     * @throws ApiError
     */
    public contractControllerGetContractSummary(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/summary',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get contract risks
     * @param id
     * @returns any Return contract risks
     * @throws ApiError
     */
    public contractControllerGetContractRisks(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/risks',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get full contract analysis
     * @param id
     * @returns any Return analysis data
     * @throws ApiError
     */
    public contractControllerGetAnalysis(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/analysis',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get contract Q&A
     * @param id
     * @returns any Return contract Q&A
     * @throws ApiError
     */
    public contractControllerGetContractQnA(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/qna',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Ask a question about the contract
     * @param id
     * @returns any Question answered successfully
     * @throws ApiError
     */
    public contractControllerAskQuestion(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/contracts/{id}/qna',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Submit a chat question
     * @param id
     * @returns any Chat answered
     * @throws ApiError
     */
    public contractControllerSubmitChat(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/contracts/{id}/chat',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get chat history
     * @param id
     * @returns any Return chat messages
     * @throws ApiError
     */
    public contractControllerGetChat(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/chat',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update risk flag status
     * @param id
     * @param riskId
     * @param requestBody
     * @returns any Risk flag updated
     * @throws ApiError
     */
    public contractControllerUpdateRiskFlag(
        id: string,
        riskId: string,
        requestBody: UpdateRiskFlagDto,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/contracts/{id}/risk-flags/{riskId}',
            path: {
                'id': id,
                'riskId': riskId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Export contract analysis
     * @param id
     * @returns any Return analysis export
     * @throws ApiError
     */
    public contractControllerExportAnalysis(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/export',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get contract reviews
     * @param id
     * @returns any Return contract reviews
     * @throws ApiError
     */
    public contractControllerGetContractReviews(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/reviews',
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
    public contractControllerHybridIngest(
        id: string,
        requestBody: IngestContractDto,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/contracts/{id}/hybrid-ingest',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param q
     * @returns any
     * @throws ApiError
     */
    public contractControllerHybridSearch(
        q: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/contracts/{id}/hybrid-search',
            query: {
                'q': q,
            },
        });
    }
}
