/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import util from "util";
import path from "path";

util.deprecate(() => { }, `${path.basename(module.filename)} is deprecated, use "datasource/hkdatasource" instead`)();
export { default } from "./datasource/hkdatasource.js";
