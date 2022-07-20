import util from "util";
import path from "path";
/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
util.deprecate(() => { }, `${path.basename(module.filename)} is deprecated, use "datasource/hkdatasource" instead`)();
export { default } from "./datasource/hkdatasource.js";
