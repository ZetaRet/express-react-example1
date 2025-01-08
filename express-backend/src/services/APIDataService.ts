import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import { ObjectId } from "mongodb";
import { RoleEnum } from "../enum/RoleEnum";
import { BodySizeEnum, BodyTypeEnum, ColorLimit, NameArray, RaceEnum, TypeEnum } from "../enum/BaseEnum";
import { OtherData } from "../enum/OtherEnum";
import { IRequest } from "../interfaces/IRequest";
import DataService from "./DataService";
import { ProfileAnotherZod, SetProfileOtherZod, SetProfileZod } from "../schemas/ZodSchemas";
import { SetProfileDTO, SetProfileOtherDTO } from "../schemas/DTO";

export default class APIDataService extends DataService {
	constructor() {
		super();
	}

	status(req: Request, res: Response) {
		let result: any = {};
		result.cookie = (req as IRequest).cookie.session;
		result.uid = (req as IRequest).redisval;
		result.user = (req as IRequest).user;
		res.send(result);
	}

	seedAgentsOtherData(insertdox: any[], insertedIds: any[]) {
		var odata = OtherData;
		let insertodox: any[] = [];
		insertdox.forEach((el: any, i: number) => {
			for (var key in odata) {
				let doc: any = {
					_id: new ObjectId(),
					unit_id: insertedIds[i],
					key: key,
					value: IndexCFG.getRndArray(Object.values(odata[key])),
				};
				insertodox.push(doc);
			}
		});
		IndexCFG.mongodb.collection("unit_data").insertMany(insertodox, { w: 1 }, function (err: any, records: any) {
			if (IndexCFG.debug) console.log("#Seed Agents Other Data:", records);
		});
		IndexCFG.mongodb
			.collection("unit_data_origin")
			.insertMany(insertodox, { w: 1 }, function (err: any, records: any) {
				if (IndexCFG.debug) console.log("#Seed Agents Other Data Origin:", records);
			});
	}

	seedAgentsOrigin(insertdox: any[], insertedIds: any[]) {
		let insertdox2: any[] = insertdox.map((el: any, i: number) => {
			let doc: any = {
				_id: new ObjectId(),
				unit_id: insertedIds[i],
				name: el.name,
				type: el.type,
				race: el.race,
				body_type: el.body_type,
				body_size: el.body_size,
				color1: el.color1,
				color2: el.color2,
			};
			return doc;
		});
		IndexCFG.mongodb.collection("units_origin").insertMany(insertdox2, { w: 1 }, function (err: any, records: any) {
			if (IndexCFG.debug) console.log("#Seed Agents Origin:", records);
		});
		this.seedAgentsOtherData(insertdox, insertedIds);
	}

	seedAgents(req: Request, res: Response) {
		const o = this;
		let insertdox: any[] = [];
		var i: number,
			maxag: number = 11;
		for (i = 0; i < maxag; i++) {
			insertdox[i] = {
				_id: new ObjectId(),
				password: btoa("password_" + i),
				role: i === 0 ? RoleEnum.agent : RoleEnum.unit,
				name: IndexCFG.getRndArray(NameArray),
				type: IndexCFG.getRndArray(Object.values(TypeEnum)),
				race: IndexCFG.getRndArray(Object.values(RaceEnum)),
				body_type: IndexCFG.getRndArray(Object.values(BodyTypeEnum)),
				body_size: IndexCFG.getRndArray(Object.values(BodySizeEnum)),
				color1: {
					r: IndexCFG.getRndMinMax(ColorLimit[0], ColorLimit[1]),
					g: IndexCFG.getRndMinMax(ColorLimit[0], ColorLimit[1]),
					b: IndexCFG.getRndMinMax(ColorLimit[0], ColorLimit[1]),
				},
				color2: {
					r: IndexCFG.getRndMinMax(ColorLimit[0], ColorLimit[1]),
					g: IndexCFG.getRndMinMax(ColorLimit[0], ColorLimit[1]),
					b: IndexCFG.getRndMinMax(ColorLimit[0], ColorLimit[1]),
				},
			};
		}
		IndexCFG.mongodb.collection("agents").insertMany(insertdox, { w: 1 }, function (err: any, records: any) {
			if (IndexCFG.debug) console.log("#Seed Agents:", records);
			o.seedAgentsOrigin(insertdox, records.insertedIds);
			res.send({ data: records.insertedIds });
		});
	}

	sendResponse(res: Response, data: any) {
		res.send(data);
	}

	profile_data(req: Request, res: Response) {
		const o = this;
		let resultd: any = {};
		resultd.cookie = (req as IRequest).cookie.session;
		resultd.uid = (req as IRequest).redisval;
		resultd.user = (req as IRequest).user;
		if (resultd.user) {
			resultd.units_origin = null;
			resultd.unit_data = null;
			resultd.unit_data_origin = null;

			var count: number = 3;
			function checkCounter() {
				count--;
				if (count === 0) o.sendResponse(res, resultd);
			}

			IndexCFG.mongodb
				.collection("unit_data_origin")
				.find({ unit_id: new ObjectId(resultd.uid) }, async (err: any, result: any) => {
					var findmany: any[] = await o.controller.findMany(result);
					resultd.unit_data_origin = findmany;
					if (IndexCFG.debug) console.log("Unit Data Origin", findmany);
					checkCounter();
				});
			IndexCFG.mongodb
				.collection("unit_data")
				.find({ unit_id: new ObjectId(resultd.uid) }, async (err: any, result: any) => {
					var findmany: any[] = await o.controller.findMany(result);
					resultd.unit_data = findmany;
					if (IndexCFG.debug) console.log("#Unit Data", findmany);
					checkCounter();
				});
			IndexCFG.mongodb
				.collection("units_origin")
				.findOne({ unit_id: new ObjectId(resultd.uid) }, (err: any, result: any) => {
					resultd.units_origin = result;
					if (IndexCFG.debug) console.log("#Units Origin", result);
					checkCounter();
				});
		} else {
			o.sendResponse(res, { err: "nonAuthUser" });
		}
	}

	profile_another_data(req: Request, res: Response) {
		const o = this;
		let resultd: any = {};
		let uid: string = req.body.uid;
		const zodsafe: any = ProfileAnotherZod.safeParse({ uid });
		if (!zodsafe.success) {
			res.send(o.controller.returnError("validation", zodsafe.error.issues));
			return;
		}

		resultd.uid = uid;
		resultd.user = null;
		resultd.units_origin = null;
		resultd.unit_data = null;
		resultd.unit_data_origin = null;

		var count: number = 4;
		function checkCounter() {
			count--;
			if (count === 0) o.sendResponse(res, resultd);
		}

		IndexCFG.mongodb.collection("agents").findOne({ _id: new ObjectId(resultd.uid) }, (err: any, result: any) => {
			resultd.user = Object.assign({}, result);
			delete resultd.user.password;
			if (IndexCFG.debug) console.log("#Agent", result);
			checkCounter();
		});
		IndexCFG.mongodb
			.collection("unit_data_origin")
			.find({ unit_id: new ObjectId(resultd.uid) }, async (err: any, result: any) => {
				var findmany: any[] = await o.controller.findMany(result);
				resultd.unit_data_origin = findmany;
				if (IndexCFG.debug) console.log("Unit Data Origin", findmany);
				checkCounter();
			});
		IndexCFG.mongodb
			.collection("unit_data")
			.find({ unit_id: new ObjectId(resultd.uid) }, async (err: any, result: any) => {
				var findmany: any[] = await o.controller.findMany(result);
				resultd.unit_data = findmany;
				if (IndexCFG.debug) console.log("#Unit Data", findmany);
				checkCounter();
			});
		IndexCFG.mongodb
			.collection("units_origin")
			.findOne({ unit_id: new ObjectId(resultd.uid) }, (err: any, result: any) => {
				resultd.units_origin = result;
				if (IndexCFG.debug) console.log("#Units Origin", result);
				checkCounter();
			});
	}

	set_profile_data(req: Request, res: Response) {
		const o = this;
		let cookie = (req as IRequest).cookie.session;
		let uid = (req as IRequest).redisval;
		let user = (req as IRequest).user;
		if (!user) {
			o.controller.returnError({ err: "nonAuthUser" });
			return;
		}

		var inputd: SetProfileDTO = {
			name: req.body.name,
			body_type: req.body.body_type,
			body_size: req.body.body_size,
			type: req.body.type,
			race: req.body.race,
			color1: req.body.color1,
			color2: req.body.color2,
		};
		const zodsafe: any = SetProfileZod.safeParse(inputd);
		if (!zodsafe.success) {
			res.send(o.controller.returnError("validation", zodsafe.error.issues));
			return;
		}
		for (var k in inputd) {
			if (!(inputd as any)[k]) delete (inputd as any)[k];
		}

		IndexCFG.mongodb
			.collection("agents")
			.updateOne({ _id: new ObjectId(uid) }, { $set: inputd }, function (err: any, result: any) {
				if (IndexCFG.debug) console.log("#Update Agent", result);
				res.send({ cookie, uid, inputd, data: result });
			});
	}

	set_profile_other_data(req: Request, res: Response) {
		const o = this;
		let cookie = (req as IRequest).cookie.session;
		let uid = (req as IRequest).redisval;
		let user = (req as IRequest).user;
		if (!user) {
			o.controller.returnError({ err: "nonAuthUser" });
			return;
		}

		var inputd: SetProfileOtherDTO = {
			face: req.body.face,
			eyes: req.body.eyes,
			skin: req.body.skin,
			mood: req.body.mood,
			language: req.body.language,
			religion: req.body.religion,
			hairstyle: req.body.hairstyle,
			dresscode: req.body.dresscode,
			glasses: req.body.glasses,
			hat: req.body.hat,
			textures: req.body.textures,
		};
		const zodsafe: any = SetProfileOtherZod.safeParse(inputd);
		if (!zodsafe.success) {
			res.send(o.controller.returnError("validation", zodsafe.error.issues));
			return;
		}
		for (var k in inputd) {
			if (!(inputd as any)[k]) delete (inputd as any)[k];
		}

		var count: number = 0;
		function checkCount() {
			count--;
			if (count === 0) res.send({ cookie, uid, inputd });
		}

		for (var key in inputd) {
			if ((inputd as any)[key]) {
				count++;
				(function (k: string) {
					if (IndexCFG.debug) console.log("#Begin Update Unit Other:", k, (inputd as any)[k]);
					let obj: any = { value: (inputd as any)[k] };
					IndexCFG.mongodb
						.collection("unit_data")
						.updateOne(
							{ unit_id: new ObjectId(uid), key: k },
							{ $set: obj },
							function (err: any, result: any) {
								if (IndexCFG.debug) console.log("#Update Unit Other:", k, result);
								checkCount();
							}
						);
				})(key);
			}
		}
	}
}
