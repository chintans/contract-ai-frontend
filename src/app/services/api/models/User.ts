/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileType } from './FileType';
import type { Role } from './Role';
import type { Status } from './Status';
export type User = {
    id: number;
    email: string;
    provider: string;
    socialId: string;
    firstName: string;
    lastName: string;
    photo: FileType;
    role: Role;
    status: Status;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
};

