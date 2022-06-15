/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = HKRepository;
declare class HKRepository {
    /**
     * Simple wrapper class representing a repository. Use HKDatasource to access it.
     *
     * @param {string} id Repository identifier.
     * @param {string} location Location URL or other location identifier (optional)
     */
    constructor(id: string, url?: undefined);
    id: string;
    url: any;
}
