import {} from '../../src/utils';
import { ErrorModule, ErrorContent } from '../../src/Error';
import { Injector, booster } from '@booster-ts/core';
import { join } from 'path';

jest.mock('../../src/utils', () => {
    return {
        loadMainPackageJSON: () => {
            return {
                package: require(join(__dirname, "ressource/ExtraData/ExtraData.package.json")),
                path: join(__dirname, "ressource/ExtraData")
            };
        }
    }
});

@booster()
class TestClass {
    constructor(
        private error: ErrorModule
    ) { }

    public doActionA() {
        return Promise.reject(this.error.createError("00", "TestClass"))
    }

    public doActionB() {
        return Promise.reject(this.error.createError("01", "TestClass"))
    }

    public doActionC() {
        return Promise.reject(this.error.createError("01", "TestClass", {httpCode: 202}));
    }
}

describe("Integration Test", () => {

    let inject: Injector;

    beforeEach(() => {
        inject = new Injector;
    });

    it("Error Should contain Extra Error Data", (done) => {
        let test = inject.inject(TestClass);

        test.doActionA()
        .catch((error) => {
            expect(error.code).toBe("00");
            expect(error.httpCode).toBe(200);
            done();
        })
    });

    it("Error Should contain Extra Error Data", (done) => {
        let test = inject.inject(TestClass);

        test.doActionB()
        .catch((error) => {
            expect(error.code).toBe("01");
            expect(error.httpCode).toBe(404);
            done();
        });
    });

    it("Overide Extra Data", (done) => {
        let test = inject.inject(TestClass);

        test.doActionC()
        .catch((error) => {
            expect(error.code).toBe("01");
            expect(error.httpCode).toBe(202);
            done();
        })
    });

});