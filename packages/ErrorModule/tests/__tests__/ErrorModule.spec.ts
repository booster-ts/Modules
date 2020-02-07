import {} from '../../src/utils';
import { ErrorModule, ErrorContent } from '../../src/Error';
import { Injector, booster } from '@booster-ts/core';
import { join } from 'path';

jest.mock('../../src/utils', () => {
    return {
        loadMainPackageJSON: () => {
            return {
                package: require(join(__dirname, "ressource/ErrorModule/ErrorModule.package.json")),
                path: join(__dirname, "ressource/ErrorModule")
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
}

describe("Integration Test", () => {

    let inject: Injector;

    beforeEach(() => {
        inject = new Injector;
    });

    it("Should give error code 00", (done) => {
        let test = inject.inject(TestClass);

        test.doActionA()
        .catch((error: ErrorContent) => {
            expect(error.code).toBe("00");
            expect(error.why).toBe("No Error")
            done();
        });
    });

    it("Should give error code 01", (done) => {
        let test = inject.inject(TestClass);

        test.doActionB()
        .catch((error: ErrorContent) => {
            expect(error.code).toBe("01");
            expect(error.why).toBe("Info Not Found");
            done();
        });
    });

    describe("IsError", () => {

        let inject: Injector;

        beforeEach(() => {
            inject = new Injector;
        });

        it("Should fail because the object is not an IError object", () => {
            let errorModule = inject.inject(ErrorModule);
            const error = {foo: "bar"};

            expect(errorModule.isError(error)).toBe(false);
        });

        it("Should pass because the object is an IError object", () => {
            let errorModule = inject.inject(ErrorModule);
            const error = {
                code: "200",
                why: "foo",
                from: "bar"
            };

            expect(errorModule.isError(error)).toBe(true);
        });
    });
});
