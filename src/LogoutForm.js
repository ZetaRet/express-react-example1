import React from "react";
import ReactFetchComponent from "./ReactFetchComponent";

export default class LogoutForm extends ReactFetchComponent {
	constructor(props) {
		super(props);
		this.state = { fetching: false, status: null };
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillUnmount() {
		console.log("Unmount Logout Form");
	}

	componentDidMount() {
		const o = this;
		console.log("Mount Logout Form");
		this.fetchAPI("/api/status/", "GET", null, (d) => {
			o.setState({ fetching: false, status: d });
		});
		o.setState({ fetching: true });
	}

	onSubmit(e) {
		const o = this;
		e.preventDefault();
		if (this.state.fetching) return false;
		const form = e.target;
		this.fetchAPI(form.action, "GET", null, (d) => {
			let status = null;
			if (!d.err) status = { cookie: d.session };
			o.setState({ fetching: false, status: status });
		});
		o.setState({ fetching: true });
		return false;
	}

	getFormHTML() {
		return (
			<form className="ltf_form" method="GET" action="/api/logout/" onSubmit={this.onSubmit}>
				<button>Logout</button>
			</form>
		);
	}

	getStatusHTML(status) {
		return (
			<div class="center">
				<span>Cookie:</span> <span>{status ? status.cookie : "no cookie"}</span>
				<br />
				<span>UID:</span> <span>{status ? status.uid : "no uid"}</span>
				<br />
				<span>Username:</span> <span>{status && status.user ? status.user.name : "no name"}</span>
			</div>
		);
	}

	render() {
		const s = this.state.status;
		console.log("#Render Logout Data:", s);
		return (
			<div>
				{this.getStatusHTML(s)}
				<br />
				{this.getFormHTML()}
				<div>{this.state.fetching ? "#Fetching Data" : "not fetching"}</div>
			</div>
		);
	}
}
