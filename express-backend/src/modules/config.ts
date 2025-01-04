import path = require("path");

const fs = require("fs");

export class ConfigENUM {
	public static enum: any = {};
}

export default async function config(app: any) {
	const file = path.join(__dirname, "./../../env.json");
	var sj = fs.readFileSync(file);
	try {
		sj = JSON.parse(sj) || {};
	} catch (e) {}
	Object.assign(ConfigENUM.enum, sj);
}
