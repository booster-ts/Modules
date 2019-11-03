import { booster } from '@booster-ts/core';
import { loadMainPackageJSON } from './utils';
import { join } from 'path';
import { readdirSync } from 'fs';

@booster()
export class ErrorModule {

    private errorCodes: IError;

    constructor() {
        const options = loadMainPackageJSON();
        if (!options.package.booster)
            throw new Error("Failed to load booster config");
        this.errorCodes = require.main.require(join(options.path, options.package.booster["error-module"]));
    }

    public createError(code: string, from: string = "", systemError: any = null): ErrorContent {
        const error: ErrorContent = {
            code,
            why: this.errorCodes[code]["why"] || "",
            from,
            systemError
        }
        Object.keys(this.errorCodes[code])
        .forEach((key) => {
            error[key] = this.errorCodes[code][key];
        })
        return error;
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