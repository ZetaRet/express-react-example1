import React from "react";

export default class ReactFetchComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	fetchAPI(action, method, data, callb) {
		const opt = {
			method: method,
		};
		if (data) {
			opt.headers = {
				"Content-Type": "application/json",
			};
			opt.body = JSON.stringify(data);
		}
		fetch(action, opt)
			.then((response) => response.json())
			.then((d) => callb(d));
	}
}
