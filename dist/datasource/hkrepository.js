"use strict";
/*
 * Copyright (c) 2021-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
class HKRepository {
    /**
     * Simple wrapper class representing a repository. Use HKDatasource to access it.
     *
     * @param {string} id Repository identifier.
     * @param {string} location Location URL or other location identifier (optional)
     */
    constructor(id, url = undefined) {
        this.id = id;
        this.url = url;
    }
}
module.exports = HKRepository;
