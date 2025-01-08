import React from "react";
import ReactFetchComponent from "./ReactFetchComponent";

export default class LoginForm extends ReactFetchComponent {
	constructor(props) {
		super(props);
		this.state = { fetching: false, status: null, data: null };
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillUnmount() {
		console.log("Unmount Login Form");
	}

	componentDidMount() {
		const o = this;
		console.log("Mount Login Form");
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
		const uidinp = form.uid;
		const passinp = form.password;
		const data = { uid: uidinp.value, password: passinp.value };
		console.log(data);
		this.fetchAPI(form.action, form.method, data, (d) => {
			uidinp.value = "";
			passinp.value = "";
			o.setState({ fetching: false, data: d });
		});
		o.setState({ fetching: true });
		return false;
	}

	getFormHTML() {
		return (
			<form className="lnf_form" method="POST" action="/api/login/" onSubmit={this.onSubmit}>
				<input name="uid" placeholder="Input UID" />
				<input name="password" placeholder="Input Password" />
				<br />
				<button>Submit</button>
			</form>
		);
	}

	getStatusHTML(status) {
		return (
			<div class="center">
				<span>Cookie:</span> <span>{status ? status.cookie : "no cookie"}</span>
				<br />
				<span>UID:</span> <span>{status ? status.uid : "no uid"}</span>
			</div>
		);
	}

	render() {
		const d = this.state.data;
		const s = this.state.status;
		console.log("#Render Login Data:", s, d);
		return (
			<div>
				{!s || s.uid == "guest" ? this.getFormHTML() : this.getStatusHTML(s)}
				<div>{this.state.fetching ? "#Fetching Data" : "not fetching"}</div>
			</div>
		);
	}
}
