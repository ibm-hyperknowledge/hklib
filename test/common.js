import HKDatasource from "../dist/datasource/hkdatasource.js";
import fs  from 'fs';

export const preamble = function () {
    /* remove `_mocha` from argv array */
    if (process.argv[1].endsWith('mocha')) {
        process.argv.splice(1, 1);
    }
    if (process.argv[2].endsWith('json')) {
				const setup = JSON.parse(fs.readFileSync(`./${process.argv[2]}`, 'utf-8'));
        if (setup.datasource) {
            let options = setup.options || {};
            const repoName = this.randomString(10);
            return new HKDatasource(setup.datasource, `${repoName}_test`, options);
        }
    }
};
export const randomString = function (len = 10) {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);
};
