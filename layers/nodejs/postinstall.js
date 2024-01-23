const fs = require('fs');

const vuePatch = 'node_modules/raw-body/index.js';

fs.readFile(vuePatch, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const modifiedData = data.replace(
        /return\s+done\(createError\(413,\s+'request\s+entity\s+too\s+large',\s+\{/g,
        "return done(createError(413, 'request entity too large: ' + length + '>' + limit, {"
    );

    fs.writeFile(vuePatch, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('File modified successfully! ' + vuePatch);
    });
});

const inMemoryLRUCache = 'node_modules/@apollo/utils.keyvaluecache/dist/InMemoryLRUCache.js';
fs.readFile(inMemoryLRUCache, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('data = ', data)
    const modifiedData = data.replace(
        /this\.cache\.clear\(\);/g,
        "console.log('fake cleared all cache.');"
    );

    fs.writeFile(inMemoryLRUCache, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(`File modified successfully! ${inMemoryLRUCache}`);
    });
});
