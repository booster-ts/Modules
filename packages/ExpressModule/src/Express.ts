import { booster } from '@booster-ts/core';
import { loadMainPackageJSON } from './utils';
import express = require('express');
import { Express } from 'express';

@booster()
export class ExpressModule {
    private app: Express;

    constructor() {
        this.app = express();
    }

    private getPort(): number | string {
        const options = loadMainPackageJSON();
        if (!options.package.booster)
            throw new Error("Failed to load booster config");
        if (!options.package.booster['express-module'])
            return 3000;
        if (isNaN(Number(options.package.booster['express-module'])))
            return process.env[options.package.booster['express-module']];
        return options.package.booster['express-module'];
    }

    /**
     * init
     * @description Inits Express Server
     */
    public init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.app.listen(this.getPort(), () => {
                resolve();
            })
            .once('error', (error) => {
                reject(error);
            })
        });
    }

    public getApp(): Express {
        return this.app;
    }

}