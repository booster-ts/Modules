module.exports = {
    rootDir: ".",
    roots: [
        "./__tests__"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    collectCoverage: true,
    coverageReporters: [
        "html",
        "lcov"
    ]
}