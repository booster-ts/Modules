# ErrorModule

An Error Module for Booster-TS.

## Getting Started

### Installation

```sh
$ npm i @booster-ts/error-module
```
### Setting Up

In you project package.json you will need to add the field **error-module** in the field **booster**
```json
"booster": {
    "error-module": "config_file.json"
}
```

### Error Config File

In the config JSON file, you will be able to declare all your errors.

```json
{
    "00": {
        "why": "No Error"
    },
    "01": {
        "why": "User already exists"
    }
}
```

Your error should contain the field why, that explains why the error occures, you can then add custom fields.

### Creating an error

The `ErrorModule`, can be injected directly in your class

```ts
import { ErrorModule } from '@booster-ts/error-module';

export class User {

    constructor(
        private error: ErrorModule
    ) { }
    
    public createUser(email: string): Promise<void> {
        return Promise.reject(this.error.createError("00", "User"))
    }
}
```

You will then receive the error in your catch handler as an ErrorContent

```ts
interface ErrorContent {
    why: string;
    from: string;
    systemError?: any;
}
```

If you specified custom fields in your config JSON they will be present too.

### createError

```ts
public createError(code: string, from: string = "", systemError: any = null): ErrorContent;
```

In the method `createError` you can specify where the error occured `from` and add the stack trace `systemError`
