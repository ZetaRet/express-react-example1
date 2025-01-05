import { Request, Response } from "express";
import BaseController from "./controllers/BaseController";
import HomeController from "./controllers/HomeController";
import IndexCFG from "./IndexCFG";
import APIController from "./controllers/APIController";
import { readFileSync } from "fs";
import { join } from "path";
import { IRequest } from "./interfaces/IRequest";
import { ObjectId } from "mongodb";

export default class ConfigRouters {
	public routers: any = {};

	constructor() {
		if (IndexCFG.debug) console.log("#ConfigRouters");
		this.middleware = this.middleware.bind(this);
	}

	async middleware(req: Request, res: Response, next: any) {
		if (IndexCFG.debug) console.log("#general middleware:", req.originalUrl);
		if (!IndexCFG.redis || !IndexCFG.mongodb) {
			if (IndexCFG.debug) console.log("_not connected");
			res.send({ err: "notConnected" });
		} else {
			var proute: boolean = IndexCFG.checkPublicRoute((req as any)._parsedUrl.pathname);
			await IndexCFG.checkCookie(req, res);
			let cookieid: string = (req as IRequest).cookie.session;
			var islogin: any = cookieid ? await IndexCFG.redis.get(cookieid) : null;
			var haslogin = islogin && islogin != "guest";
			if (IndexCFG.debug) console.log(proute, islogin, IndexCFG.sessionData, (req as any).cookie);
			if (haslogin || proute) {
				if (haslogin && !proute) {
					this.checkUser(islogin, (uid: string, result: any) => {
						if (result) next();
						else res.send({ err: "wrongSession" });
					});
				} else next();
			} else res.send({ err: "requireLogin" });
		}
	}

	checkUser(uid: string, callback: Function) {
		console.log("@check user", uid);
		IndexCFG.mongodb.collection("agents").findOne({ _id: new ObjectId(uid) }, (err: any, result: any) => {
			if (IndexCFG.debug) console.log("#Check User:", result);
			callback(uid, result);
		});
	}

	addController(ctrl: any, app: any, id: string) {
		const router = new IndexCFG.express.Router();
		app.use("/api", router);
		this.routers[id] = router;
		let control: BaseController = new ctrl();
		control.configRouter(router);
	}

	pushPublicRoutes() {
		IndexCFG.publicRoutes.push("/");
		IndexCFG.publicRoutes.push("/login/");
		IndexCFG.publicRoutes.push("/profile/");
		IndexCFG.publicRoutes.push("/api/home/");
		IndexCFG.publicRoutes.push("/api/login/");
		IndexCFG.publicRoutes.push("/api/status/");
		IndexCFG.publicRoutes.push("/api/seedAgents/");
	}

	renderEmpty(req: Request, res: Response) {
		res.send();
	}

	renderIndex(req: Request, res: Response) {
		let p: string = join(__dirname, "./../../public_html/index.html");
		let html: string = readFileSync(p, "utf8");
		res.send(html);
	}

	config(app: any) {
		const o = this;
		o.pushPublicRoutes();
		app.use(o.middleware);
		app.get("/favicon.ico", o.renderEmpty);
		app.get("/login/", o.renderIndex);
		app.get("/profile/", o.renderIndex);
		app.get("/edit_profile/", o.renderIndex);
		this.addController(HomeController, app, "home");
		this.addController(APIController, app, "api");
	}
}
