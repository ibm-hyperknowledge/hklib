/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

const object = {
    REPOSITORY: 'repository',
    ENTITIES: 'entities'
};
const action = {
    CREATE: 'create',
    DELETE: 'delete',
    UPDATE: 'update'
};
const httpMethodByAction = {};
httpMethodByAction[action.CREATE] = 'POST';
httpMethodByAction[action.DELETE] = 'DELETE';
httpMethodByAction[action.UPDATE] = 'PUT';
export { object };
export { action };
export { httpMethodByAction };
