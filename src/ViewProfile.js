import React from "react";
import ReactFetchComponent from "./ReactFetchComponent";

export default class ViewProfile extends ReactFetchComponent {
	constructor(props) {
		super(props);
		this.state = { fetching: false, data: null };
	}

	componentWillUnmount() {
		console.log("Unmount View Profile");
	}

	componentDidMount() {
		const o = this;
		const id = this.props.propid;
		console.log("Mount View Profile:", id);
		if (id) {
			this.fetchAPI("/api/profile_another_data/", "POST", { uid: id }, (d) => {
				o.setState({ fetching: false, data: d });
			});
		} else {
			this.fetchAPI("/api/profile_data/", "GET", null, (d) => {
				o.setState({ fetching: false, data: d });
			});
		}

		o.setState({ fetching: true });
	}

	getStatusHTML(data) {
		return (
			<div>
				<span>No Profile Data</span>
			</div>
		);
	}

	encodeColorObj(color) {
		return "[Red: " + color.r + ", Green: " + color.g + ", Blue: " + color.b + "]";
	}

	getUserView(user) {
		var key;
		var userview = [];
		for (key in user) {
			let k = key;
			let kv = user[key];
			if (key == "password") {
				kv = atob(kv);
				k = "password (decoded)";
			} else if (key == "color1" || key == "color2") {
				kv = this.encodeColorObj(kv);
			}
			userview.push({ key, k, kv });
		}
		const userviewmap = userview.map((e) => (
			<tr key={e.key} className="tableitem">
				<td>{e.k}:</td>
				<td>{e.kv}</td>
			</tr>
		));
		return <>{userviewmap}</>;
	}

	getProfileHTML(data) {
		return (
			<div className="user-view">
				<div className="center">User:</div>
				<div className="tablediv">
					<table>
						<tbody>
							<tr className="tablehead">
								<th>Key</th>
								<th>Value</th>
							</tr>
							{this.getUserView(data.user)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	getProfileOriginHTML(data) {
		return (
			<div className="user-origin-view">
				<div className="center">User Origin:</div>
				<div className="tablediv">
					<table>
						<tbody>
							<tr className="tablehead">
								<th>Key</th>
								<th>Value</th>
							</tr>
							{this.getUserView(data.units_origin)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	getProfileDataHTML(data) {
		return (
			<div className="user-data-view">
				<div className="center">User Data:</div>
				<div className="tablediv">
					<table>
						<tbody>
							<tr className="tablehead">
								<th>Key</th>
								<th>Value</th>
							</tr>
							{this.getUserView(this.arrayToObject(data.unit_data))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	getProfileDataOriginHTML(data) {
		return (
			<div className="user-data-origin-view">
				<div className="center">User Data Origin:</div>
				<div className="tablediv">
					<table>
						<tbody>
							<tr className="tablehead">
								<th>Key</th>
								<th>Value</th>
							</tr>
							{this.getUserView(this.arrayToObject(data.unit_data_origin))}
						</tbody>
					</table>
				</div>
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
			<div className="profile-view">
				{this.getProfileHTML(data)}
				<br />
				{this.getProfileOriginHTML(data)}
				<br />
				{this.getProfileDataHTML(data)}
				<br />
				{this.getProfileDataOriginHTML(data)}
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
				<div>{this.state.fetching ? "#Fetching Data" : "not fetching"}</div>
			</div>
		);
	}
}
