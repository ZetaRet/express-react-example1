import IndexCFG from "./IndexCFG";

export default async function modules_setup() {
	var res;
	const modules = IndexCFG.modules;
	const app = await (modules[0] as any)();
	for (let i = 1; i < modules.length; i++) {
		res = await modules[i](app);
	}
	if (IndexCFG.debug) console.log("#Modules Setup");
}
