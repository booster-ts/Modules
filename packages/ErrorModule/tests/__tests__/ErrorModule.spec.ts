import '../../src/utils';
import { ErrorModule, ErrorContent, IError } from '../../src/Error';
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
    ) {
        this.error.use(this.hook.bind(this));
    }

    public hook(error: IError) {
        return;
    }

    public doActionA() {
        return Promise.reject(this.error.createError("00", "TestClass"))
    }

    public doActionB() {
        return Promise.reject(this.error.createError("01", "TestClass"))
    }
}

describe("Integration Test", () => {

    let inject: Injector;

    describe('Basic Tests', () => {

        let test: TestClass;

        beforeEach(() => {
            inject = new Injector;
            test = inject.inject(TestClass);
        });

        it("Should give error code 00", (done) => {
            test.doActionA()
            .catch((error: ErrorContent) => {
                expect(error.code).toBe("00");
                expect(error.why).toBe("No Error")
                done();
            });
        });

        it("Should give error code 01", (done) => {
            test.doActionB()
            .catch((error: ErrorContent) => {
                expect(error.code).toBe("01");
                expect(error.why).toBe("Info Not Found");
                done();
            });
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

    describe("Hooks", () => {

        let test: TestClass;

        beforeEach(() => {
            inject = new Injector;
            test = inject.inject(TestClass);
        });

        it("Should call hook", (done) => {
            const hookSpy = spyOn(test,'hook').and.callFake((error) => {
                expect(error.code).toBe("00");
                expect(error.why).toBe("No Error")
            });

            inject.inject(ErrorModule).use(test.hook);

            test.doActionA().catch(() => {
                expect(hookSpy).toHaveBeenCalled();
                done();
            })
        });

        it("Should call all hooks", (done) => {
            const hookSpy = spyOn(test,'hook').and.callFake((error) => {
                expect(error.code).toBe("00");
                expect(error.why).toBe("No Error")
            });

            inject.inject(ErrorModule).use(test.hook);
            inject.inject(ErrorModule).use(test.hook);

            test.doActionA().catch(() => {
                expect(hookSpy).toHaveBeenCalledTimes(2);
                done();
            })
        });
    })
    
});
