import IndexCFG from "./IndexCFG";

const express: any = require("express");

export default async function bootstrap() {
	IndexCFG.express = express;
	const app = express();
	IndexCFG.app = app;
	console.log("#Bootstrap App");
	return app;
};