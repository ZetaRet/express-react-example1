console.log("#Init Modules");

import bootstrap from "./bootstrap";
import ConfigRouters from "./ConfigRouters";
import IndexCFG from "./IndexCFG";
import config from "./modules/config";
import listening from "./modules/listening";
import mongodb from "./modules/mongodb";
import redis from "./modules/redis";
import use from "./modules/use";
import modules_setup from "./modules_setup";

IndexCFG.modules = [bootstrap, config, listening, use, mongodb, redis];

(async function () {
	await modules_setup();
	const cfgRouter: ConfigRouters = new ConfigRouters();
	cfgRouter.config(IndexCFG.app);
})();
