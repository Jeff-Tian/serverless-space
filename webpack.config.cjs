const path = require('path')

module.exports = function (options, webpack) {
    const finalOptions = {
        ...options,
        entry: {
            main: 'src/main',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.mjs',
            environment: {
                module: true, // Enable ECMAScript Modules (ESM) output
            },
        },
        plugins: []
    }

    console.log('finalOptions = ', JSON.stringify(finalOptions, null, 2));

    return finalOptions;
}
