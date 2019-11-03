/**
 * loadMainPackageJSON
 * @description Searches for Main App Package.json
 * @param attempts 
 */
export function loadMainPackageJSON(attempts: number = 1): {package: IPackage, path: string} {
    attempts = attempts || 1;
    if (attempts > 5)
        throw new Error('Can\'t resolve main package.json file');
    var mainPath = attempts === 1 ? './' : Array(attempts).join("../");
    try {
        return {
            package: require.main.require(mainPath + 'package.json'),
            path: mainPath
        }
    } catch (e) {
        return this.loadMainPackageJSON(attempts + 1);
    }
}

interface IPackage {
    readonly name: string;
    readonly version: string;
    readonly booster?: {
        "express-module"?: string | number;
    };
}