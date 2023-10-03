const fs = require('fs');

function patchFile(patch) {
    fs.readFile(patch, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const modifiedData = data.replace(
            /return\s+done\(createError\(413,\s+'request\s+entity\s+too\s+large',\s+\{/g,
            "return done(createError(413, 'request entity too large: ' + length + '>' + limit, {"
        );

        fs.writeFile(patch, modifiedData, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log('File modified successfully! ' + patch);
        });
    });
}

patchFile('node_modules/raw-body/index.js');
patchFile('node_modules/@nestjs/platform-express/node_modules/raw-body/index.js');
