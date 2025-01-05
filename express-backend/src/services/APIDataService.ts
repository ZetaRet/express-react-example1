import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import { ObjectId } from "mongodb";
import { RoleEnum } from "../enum/RoleEnum";
import { BodySizeEnum, BodyTypeEnum, ColorLimit, NameArray, RaceEnum, TypeEnum } from "../enum/BaseEnum";
import { OtherData } from "../enum/OtherEnum";

export default class APIDataService {
	constructor() {}

	status(req: Request, res: Response) {
		let result: any = {};
		result.cookie = (req as any).cookie.session;
		result.uid = (req as any).redisval;
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
}
