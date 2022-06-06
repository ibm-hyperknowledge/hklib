'use strict';

const HKDatasource = require("../dist/datasource/hkdatasource");


module.exports.preamble = function ()
{

	/* remove `_mocha` from argv array */
	if (process.argv[1].endsWith ('mocha'))
	{
		process.argv.splice (1,1);
	}

	if (process.argv[2].endsWith ('json'))
	{
		const setup = require(`../${process.argv[2]}`);


		if(setup.datasource)
		{
      let options = setup.options || {};
			const repoName = this.randomString(10)
			return new HKDatasource(setup.datasource, `${repoName}_test`, options);
		}
	}	
}

module.exports.randomString = function (len = 10)
{
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);
};