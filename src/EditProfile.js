import React from "react";
import ReactFetchComponent from "./ReactFetchComponent";

export default class EditProfile extends ReactFetchComponent {
	constructor(props) {
		super(props);
		this.state = { fetching: false, f1: false, data: null, enums: null };
		this.onSubmitBase = this.onSubmitBase.bind(this);
		this.onSubmitOther = this.onSubmitOther.bind(this);
	}

	componentWillUnmount() {
		console.log("Unmount Edit Profile");
	}

	componentDidMount() {
		const o = this;
		console.log("Mount Edit Profile");
		this.fetchAPI("/api/profile_data/", "GET", null, (d) => {
			o.setState({ fetching: false, data: d });
		});
		this.fetchAPI("/api/enums/", "GET", null, (d) => {
			d.colorRange = [];
			for (var i = 0; i <= 255; i++) d.colorRange[i] = i;
			d.base.color1_r = d.base.color1_g = d.base.color1_b = d.colorRange;
			d.base.color2_r = d.base.color2_g = d.base.color2_b = d.colorRange;
			o.setState({ f1: false, enums: d });
		});
		o.setState({ fetching: true, f1: true });
	}

	isFetching() {
		return this.state.fetching || this.state.f1;
	}

	onSubmitBase(e) {
		const o = this;
		e.preventDefault();
		if (this.isFetching()) return false;
		const form = e.target;
		const nameinp = form.name;
		const bodytypeinp = form.body_type;
		const bodysizeinp = form.body_size;
		const typeinp = form.type;
		const raceinp = form.race;
		const data = {
			name: nameinp.value,
			body_type: bodytypeinp.value,
			body_size: bodysizeinp.value,
			type: typeinp.value,
			race: raceinp.value,
			color1: { r: +form.color1_r.value, g: +form.color1_g.value, b: +form.color1_b.value },
			color2: { r: +form.color2_r.value, g: +form.color2_g.value, b: +form.color2_b.value },
		};
		console.log(data);
		this.fetchAPI(form.action, form.method, data, (d) => {
			o.setState({ fetching: false });
		});
		o.setState({ fetching: true });
		return false;
	}

	onSubmitOther(e) {
		const o = this;
		e.preventDefault();
		if (this.isFetching()) return false;
		const form = e.target;
		const data = {
			face: form.face.value,
			eyes: form.eyes.value,
			skin: form.skin.value,
			mood: form.mood.value,
			language: form.language.value,
			religion: form.religion.value,
			hairstyle: form.hairstyle.value,
			dresscode: form.dresscode.value,
			glasses: form.glasses.value,
			hat: form.hat.value,
			textures: form.textures.value,
		};
		console.log(data);
		this.fetchAPI(form.action, form.method, data, (d) => {
			o.setState({ fetching: false });
		});
		o.setState({ fetching: true });
		return false;
	}

	getStatusHTML(data) {
		return (
			<div>
				<span>No Profile Data</span>
			</div>
		);
	}

	encodeColorObj(user) {
		if (user.color1) {
			user.color1_r = user.color1.r;
			user.color1_g = user.color1.g;
			user.color1_b = user.color1.b;
			user.color2_r = user.color2.r;
			user.color2_g = user.color2.g;
			user.color2_b = user.color2.b;
		}
	}

	getEnumSelector(key, enums) {
		let options = enums.map((el) => (
			<option key={el} value={el}>
				{el}
			</option>
		));

		return <select name={key}>{options}</select>;
	}

	getUserView(user, enums) {
		const o = this;
		var key;
		var userview = [];

		o.encodeColorObj(user);
		let skipkeys = ["_id", "password", "role", "color1", "color2"];

		for (key in user) {
			let k = key;
			let kv = user[key];
			if (skipkeys.indexOf(key) >= 0) continue;
			userview.push({ key, k, kv });
		}
		const userviewmap = userview.map((e) => (
			<tr key={e.key} className="tableitem">
				<td>{e.k}:</td>
				<td>
					<input name={e.key} defaultValue={e.kv} ref={(el) => (o["input_" + e.key] = el)} />
				</td>
				<td>
					{enums && enums[e.key] ? (
						o.getEnumSelector("select_" + e.key, enums[e.key])
					) : (
						<span>No Select</span>
					)}
				</td>
			</tr>
		));

		return <>{userviewmap}</>;
	}

	getProfileHTML(data) {
		const enums = this.state.enums;
		return (
			<div className="user-edit">
				<div className="center">User:</div>
				<form className="ue_form" action="/api/set_profile_data/" method="POST" onSubmit={this.onSubmitBase}>
					<div className="tablediv">
						<table>
							<tbody>
								<tr className="tablehead">
									<th>Key</th>
									<th>Value</th>
									<th>Selector</th>
								</tr>
								{this.getUserView(data.user, enums ? enums.base : {})}
							</tbody>
						</table>
					</div>
					<button>Submit</button>
				</form>
			</div>
		);
	}

	getProfileDataHTML(data) {
		const enums = this.state.enums;
		return (
			<div className="user-data-edit">
				<div className="center">User Data:</div>
				<form
					className="ude_form"
					action="/api/set_profile_other_data/"
					method="POST"
					onSubmit={this.onSubmitOther}
				>
					<div className="tablediv">
						<table>
							<tbody>
								<tr className="tablehead">
									<th>Key</th>
									<th>Value</th>
									<th>Selector</th>
								</tr>
								{this.getUserView(this.arrayToObject(data.unit_data), enums ? enums.other : {})}
							</tbody>
						</table>
					</div>
					<button>Submit</button>
				</form>
			</div>
		);
	}

	arrayToObject(arr) {
		let obj = {};
		arr.forEach((e) => (obj[e.key] = e.value));
		return obj;
	}

	getUserProfileHTML(data) {
		return (
			<div className="profile-edit">
				{this.getProfileHTML(data)}
				<br />
				{this.getProfileDataHTML(data)}
			</div>
		);
	}

	render() {
		const da = this.state.data;
		console.log("#Render Profile Data:", da);
		return (
			<div>
				{!da || !da.user ? this.getStatusHTML(da) : this.getUserProfileHTML(da)}
				<br />
				<div>{this.isFetching() ? "#Fetching Data" : "not fetching"}</div>
			</div>
		);
	}
}
