/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

module.exports.object = {
	REPOSITORY: 'repository',
	ENTITIES: 'entities'
};

module.exports.action = {
	CREATE: 'create',
	DELETE: 'delete',
	UPDATE: 'update'
};

let httpMethodByAction = {};
httpMethodByAction[CREATE] = 'POST'; 
httpMethodByAction[DELETE] = 'DELETE'; 
httpMethodByAction[UPDATE] = 'PUT';
module.exports.httpMethodByAction;
