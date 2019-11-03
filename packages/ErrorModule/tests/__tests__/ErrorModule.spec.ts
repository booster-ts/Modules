import { ErrorModule, ErrorContent } from '../../src/Error';
import { Injector, booster } from '@booster-ts/core';

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
    })

    it("Should give error code 00", (done) => {
        let test = inject.inject(TestClass);

        test.doActionA()
        .catch((error: ErrorContent) => {
            expect(error.code).toBe("00");
            done();
        })
    })
});