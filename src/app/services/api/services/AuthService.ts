/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { AuthAppleLoginDto } from '../models/AuthAppleLoginDto';
import type { AuthConfirmEmailDto } from '../models/AuthConfirmEmailDto';
import type { AuthEmailLoginDto } from '../models/AuthEmailLoginDto';
import type { AuthFacebookLoginDto } from '../models/AuthFacebookLoginDto';
import type { AuthForgotPasswordDto } from '../models/AuthForgotPasswordDto';
import type { AuthGoogleLoginDto } from '../models/AuthGoogleLoginDto';
import type { AuthRegisterLoginDto } from '../models/AuthRegisterLoginDto';
import type { AuthResetPasswordDto } from '../models/AuthResetPasswordDto';
import type { AuthUpdateDto } from '../models/AuthUpdateDto';
import type { LoginResponseDto } from '../models/LoginResponseDto';
import type { RefreshResponseDto } from '../models/RefreshResponseDto';
import type { User } from '../models/User';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns LoginResponseDto
     * @throws ApiError
     */
    public authControllerLoginV1(
        requestBody: AuthEmailLoginDto,
    ): Observable<LoginResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/email/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public authControllerRegisterV1(
        requestBody: AuthRegisterLoginDto,
    ): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/email/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public authControllerConfirmEmailV1(
        requestBody: AuthConfirmEmailDto,
    ): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/email/confirm',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public authControllerConfirmNewEmailV1(
        requestBody: AuthConfirmEmailDto,
    ): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/email/confirm/new',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public authControllerForgotPasswordV1(
        requestBody: AuthForgotPasswordDto,
    ): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/forgot/password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public authControllerResetPasswordV1(
        requestBody: AuthResetPasswordDto,
    ): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/reset/password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns User
     * @throws ApiError
     */
    public authControllerMeV1(): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/auth/me',
        });
    }
    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public authControllerUpdateV1(
        requestBody: AuthUpdateDto,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/v1/auth/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public authControllerDeleteV1(): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/v1/auth/me',
        });
    }
    /**
     * @returns RefreshResponseDto
     * @throws ApiError
     */
    public authControllerRefreshV1(): Observable<RefreshResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/refresh',
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public authControllerLogoutV1(): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/logout',
        });
    }
    /**
     * @param requestBody
     * @returns LoginResponseDto
     * @throws ApiError
     */
    public authFacebookControllerLoginV1(
        requestBody: AuthFacebookLoginDto,
    ): Observable<LoginResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/facebook/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns LoginResponseDto
     * @throws ApiError
     */
    public authGoogleControllerLoginV1(
        requestBody: AuthGoogleLoginDto,
    ): Observable<LoginResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/google/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns LoginResponseDto
     * @throws ApiError
     */
    public authAppleControllerLoginV1(
        requestBody: AuthAppleLoginDto,
    ): Observable<LoginResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/auth/apple/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
