import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import { ObjectId } from "mongodb";
import { RoleEnum } from "../enum/RoleEnum";
import { BodySizeEnum, BodyTypeEnum, ColorLimit, NameArray, RaceEnum, TypeEnum } from "../enum/BaseEnum";

export default class APIDataService {
	constructor() {}

	status(req: Request, res: Response) {
		let result: any = {};
		result.cookie = (req as any).cookie.session;
		result.uid = (req as any).redisval;
		res.send(result);
	}

	seedAgents(req: Request, res: Response) {
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
			res.send({ data: records.insertedIds });
		});
	}
}
