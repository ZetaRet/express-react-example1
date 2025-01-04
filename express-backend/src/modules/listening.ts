import { ConfigENUM } from "./config";

export default async function listening(app: any) {
	const port = ConfigENUM.enum.port || 4000;
	app.listen(port, () => {
		console.log(`Listening at http://localhost:${port}`)
	});
}