import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Outlet, useSearchParams } from "react-router-dom";
import ViewProfile from "./ViewProfile";
import EditProfile from "./EditProfile";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";
import ListProfiles from "./ListProfiles";

const Home = () => {
	return (
		<div>
			<h2>Home</h2>
		</div>
	);
};

const Login = () => {
	return (
		<div>
			<h2>Login</h2>
			<nav>
				<ul>
					<li>
						<Link to="/profile/">View Profile</Link>
					</li>
					<li>
						<Link to="/edit_profile/">Edit Profile</Link>
					</li>
					<li>
						<Link to="/list_profiles/">List Profiles</Link>
					</li>
					<li>
						<Link to="/logout/">Logout</Link>
					</li>
				</ul>
			</nav>
			<br />
			<div>
				<LoginForm />
			</div>
			<Outlet />
		</div>
	);
};

const ViewProfileWrapper = () => {
	return <ViewProfile />;
};

const EditProfileWrapper = () => {
	return <EditProfile />;
};

const ViewAnotherProfileWrapper = () => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	return <ViewProfile propid={id} />;
};

const ListProfileWrapper = () => {
	return <ListProfiles />;
};

export default function App() {
	return (
		<div>
			<h1>Express + React with Short Webpack and Router</h1>
			<Router>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/login/">Login</Link>
						</li>
					</ul>
				</nav>
				<br />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login/" element={<Login />} />
					<Route path="/logout/" element={<LogoutForm />} />
					<Route path="/profile/" element={<ViewProfileWrapper />} />
					<Route path="/edit_profile/" element={<EditProfileWrapper />} />
					<Route path="/list_profiles/" element={<ListProfileWrapper />} />
					<Route path="/view_profile/" element={<ViewAnotherProfileWrapper />} />
				</Routes>
			</Router>
		</div>
	);
}
