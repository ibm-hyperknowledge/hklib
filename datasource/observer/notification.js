/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const object = {
	REPOSITORY: 'repository',
	ENTITIES: 'entities'
};
module.exports.object = object;

const action = {
	CREATE: 'create',
	DELETE: 'delete',
	UPDATE: 'update'
};
module.exports.action = action;

const httpMethodByAction = {};
httpMethodByAction[action.CREATE] = 'POST';
httpMethodByAction[action.DELETE] = 'DELETE';
httpMethodByAction[action.UPDATE] = 'PUT';
module.exports.httpMethodByAction = httpMethodByAction;
