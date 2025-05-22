/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { CreateUserDto } from '../models/CreateUserDto';
import type { InfinityPaginationUserResponseDto } from '../models/InfinityPaginationUserResponseDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public usersControllerCreateV1(
        requestBody: CreateUserDto,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param limit
     * @param filters
     * @param sort
     * @returns InfinityPaginationUserResponseDto
     * @throws ApiError
     */
    public usersControllerFindAllV1(
        page?: number,
        limit?: number,
        filters?: string,
        sort?: string,
    ): Observable<InfinityPaginationUserResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/users',
            query: {
                'page': page,
                'limit': limit,
                'filters': filters,
                'sort': sort,
            },
        });
    }
    /**
     * @param id
     * @returns User
     * @throws ApiError
     */
    public usersControllerFindOneV1(
        id: string,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public usersControllerUpdateV1(
        id: string,
        requestBody: UpdateUserDto,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public usersControllerRemoveV1(
        id: string,
    ): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
        });
    }
}
