/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

/* eslint-disable */
export type UpdateRiskFlagDto = {
    status: UpdateRiskFlagDto.status;
    notes?: string;
};
export namespace UpdateRiskFlagDto {
    export enum status {
        OPEN = 'open',
        RESOLVED = 'resolved',
        IGNORED = 'ignored',
    }
}

