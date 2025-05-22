/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

/* eslint-disable */
import type { FileDto } from './FileDto';
import type { RoleDto } from './RoleDto';
import type { StatusDto } from './StatusDto';
export type UpdateUserDto = {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    photo?: FileDto;
    role?: RoleDto;
    status?: StatusDto;
};

