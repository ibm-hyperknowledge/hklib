/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import HKDatasource from "../dist/mjs/datasource/hkdatasource.js";
import { readFile } from 'fs/promises';


export const preamble = async function () {
    /* remove `_mocha` from argv array */
    if (process.argv[1].endsWith('mocha')) {
        process.argv.splice(1, 1);
    }

    const setup = JSON.parse(
        await readFile(
          new URL('./setup.json', import.meta.url)
        )
      );

    if (setup.datasource) {
        let options = setup.options || {};
        const repoName = this.randomString(10);
        const ds = new HKDatasource(setup.datasource, `${repoName}_test`, options);
        return ds;
    }
};
export const randomString = function (len = 10) {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);
};
