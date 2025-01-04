import path = require("path");
import IndexCFG from "./../IndexCFG";

const express: any = require("express");
const cookieParser: any = require("cookie-parser");
const cookieSession: any = require("cookie-session");
const bodyParser: any = require("body-parser");

export default async function use(app: any) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(express.static(path.join(__dirname, "./../../../", "public_html")));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(
		cookieSession({
			name: IndexCFG.sessionId,
			keys: ["key1", "key2"],
			maxAge: 30 * 24 * 60 * 60 * 1000,
		})
	);
}
