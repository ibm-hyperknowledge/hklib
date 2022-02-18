/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

/* Let's keep this file for now so current applications don't crash */

const util = require('util');
const path = require('path');

util.deprecate(() => { },
  `${path.basename(module.filename)} is deprecated, use "datasource/hkdatasource" instead`)
  ();

module.exports = require('./datasource/hkdatasource');
