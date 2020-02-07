import { booster } from '@booster-ts/core';
import { loadMainPackageJSON } from './utils';
import { join } from 'path';

@booster()
export class ErrorModule {

    private errorCodes: IError;

    constructor() {
        const options = loadMainPackageJSON();
        if (!options.package.booster)
            throw new Error("Failed to load booster config");
        this.errorCodes = require.main.require(join(options.path, options.package.booster["error-module"]));
    }

    /**
     * createError
     * @param code Error Code
     * @param from Where the Error Occured
     * @param overides Value that should be overidden from Error Conf file
     * @param systemError NodeJS Error StackTrace
     */
    public createError(code: string, from: string = "", overides = {}, systemError: any = null): ErrorContent {
        let error: ErrorContent = {
            code,
            why: this.errorCodes[code]["why"] || "",
            from,
            systemError
        }
        error = { ...error, ...this.errorCodes[code], ...overides };
        return error;
    }

    /**
     * isError
     * @description Check if the object is an IError object
     * @param error object you want to test
     */
    public isError(error: object): boolean {
        return (error && error.hasOwnProperty('code') && error.hasOwnProperty('why') && error.hasOwnProperty('from'));
    }
}

export interface ErrorContent {
    code: string;
    why: string;
    from: string;
    systemError?: any;
}

export type IError = {
    [id: string]: any;
}