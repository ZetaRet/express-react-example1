import React from "react";
import ReactFetchComponent from "./ReactFetchComponent";
import { Link } from "react-router-dom";

export default class ListProfiles extends ReactFetchComponent {
	constructor(props) {
		super(props);
		this.state = { fetching: false, data: null };
	}

	componentWillUnmount() {
		console.log("Unmount List Profiles");
	}

	componentDidMount() {
		const o = this;
		console.log("Mount List Profiles");
		this.fetchAPI("/api/agents/", "GET", null, (d) => {
			o.setState({ fetching: false, data: d });
		});
		o.setState({ fetching: true });
	}

	getView(data) {
		var userviewmap = data.map((el) => (
			<tr key={el._id} className="tableitem">
				<td>{el._id}</td>
				<td>{el.name}</td>
				<td>{el.role}</td>
				<td>
					<Link to={"/view_profile/?id=" + el._id}>View</Link>
				</td>
			</tr>
		));
		return <>{userviewmap}</>;
	}

	getProfilesHTML(data) {
		return (
			<div className="user-view">
				<div className="center">Profiles List:</div>
				<div className="tablediv">
					<table>
						<tbody>
							<tr className="tablehead">
								<th>Id</th>
								<th>Name</th>
								<th>Role</th>
								<th></th>
							</tr>
							{this.getView(data)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	render() {
		const da = this.state.data;

		return (
			<div>
				{da ? this.getProfilesHTML(da) : <span>No Data</span>}
				<br />
				<div>{this.state.fetching ? "#Fetching Data" : "not fetching"}</div>
			</div>
		);
	}
}
