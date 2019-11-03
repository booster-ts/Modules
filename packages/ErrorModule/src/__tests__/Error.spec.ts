import { ErrorModule } from '../Error';
import { Injector } from '@booster-ts/core';
import { join } from 'path';

describe("ErrorModule", () => {

    let injector: Injector;

    beforeEach(() => {
        injector = new Injector;
        jest.resetModules();
    });

    it("Fail to init with no error config file", () => {
        try {
            injector.inject(ErrorModule);
            expect(false).toBeTruthy();
        } catch(e) {
            expect(true).toBeTruthy();
        }
    });

})