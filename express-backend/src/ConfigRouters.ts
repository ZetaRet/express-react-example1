import { Request, Response } from "express";
import BaseController from "./controllers/BaseController";
import HomeController from "./controllers/HomeController";
import IndexCFG from "./IndexCFG";
import APIController from "./controllers/APIController";

export default class ConfigRouters {
	public routers: any = {};
	public debug: boolean = true;

	constructor() {
		console.log("#ConfigRouters");
		this.middleware = this.middleware.bind(this);
	}

	async middleware(req: Request, res: Response, next: any) {
		console.log("#general middleware:", req.originalUrl);
		if (!IndexCFG.redis || !IndexCFG.mongodb) {
			if (this.debug) console.log("_not connected");
			res.send({ err: "notConnected" });
		} else {
			var proute: boolean = IndexCFG.checkPublicRoute((req as any)._parsedUrl.pathname);
			await IndexCFG.checkCookie(req, res);
			let cookieid: string = (req as any).cookie.session;
			var islogin: any = cookieid ? await IndexCFG.redis.get(cookieid) : null;
			if (this.debug) console.log(proute, islogin, IndexCFG.sessionData, (req as any).cookie);
			if ((islogin && islogin != "guest") || proute) {
				next();
			} else res.send({ err: "requireLogin" });
		}
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
		IndexCFG.publicRoutes.push("/api/home/");
		IndexCFG.publicRoutes.push("/api/login/");
		IndexCFG.publicRoutes.push("/api/status/");
	}

	config(app: any) {
		const o = this;
		o.pushPublicRoutes();
		app.use(o.middleware);
		app.get("/favicon.ico", function (req: any, res: any) {
			res.send();
		});
		this.addController(HomeController, app, "home");
		this.addController(APIController, app, "api");
	}
}
