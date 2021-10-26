/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";


exports.NODE      = 'node';
exports.CONTEXT   = 'context';
exports.LINK      = 'link';
exports.CONNECTOR = 'connector';
exports.REFERENCE = 'ref';
exports.INTERFACE = 'interface';
exports.BIND      = 'bind';
exports.TRAIL     = 'trail';
exports.VIRTUALCONTEXT     = 'virtualcontext';

exports.isValidType = function (type)
{
	for (let key in exports)
	{
		if (exports[key] === type)
		{
			return true;
		}
	}
	return false;
}
