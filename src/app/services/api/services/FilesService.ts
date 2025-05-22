/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { FileResponseDto } from '../models/FileResponseDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class FilesService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param formData
     * @returns FileResponseDto
     * @throws ApiError
     */
    public filesLocalControllerUploadFileV1(
        formData: {
            file?: Blob;
        },
    ): Observable<FileResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/files/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
