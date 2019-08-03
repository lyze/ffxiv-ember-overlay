import React from "react";
import { connect } from "react-redux";
import { updateState } from "../../redux/actions/index";
import { Container } from "semantic-ui-react";

import VersionService from "../../services/VersionService";

class About extends React.Component {
	componentWillMount() {
		this.setState({
			changelog: <p>Loading changelog...</p>
		});

		VersionService.getChangelogForUser()
			.then((data) => {
				let changelog = [];

				if (typeof data === "string") {
					changelog = <p>{data}</p>;
				} else {
					for (let item_type in data) {
						let count = 0;
						let items = data[item_type].map((item) => {
							count++;

							return <li key={item_type + "-" + count}>{item}</li>
						});

						let ul = <ul>{items}</ul>

						changelog.push(
							<Container fluid className="changelog-section" key={item_type + "-section"}>
								<h4>{item_type}</h4>
								{ul}
							</Container>
						);
					}
				}

				this.setState({
					changelog: changelog
				});
			})
			.catch((e) => {
				console.log(e);
			});

		let new_data = {
			key   : "internal.new_version",
			value : false
		}

		this.props.updateState(new_data);
	}

	render() {
		let github_url    = process.env.REACT_APP_GITHUB_URL;
		let discord_url   = process.env.REACT_APP_DISCORD_URL;
		let author_url    = process.env.REACT_APP_AUTHOR_URL;
		let changelog_url = process.env.REACT_APP_CHANGELOG_URL;

		let state = this.state || {};

		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>EMBER OVERLAY</h2>
					<p>Developed by <a href={author_url} target="_blank" rel="noopener noreferrer">GoldenChrysus</a>.</p>

					<h3>Discord</h3>
					<p>
						Join the Discord to receive live updates from the developer, submit feature suggestions, get help with a bug or issue, or discuss FFXIV in general with other users.
					</p>
					<p>
						<a href={discord_url} target="_blank" rel="noopener noreferrer">
							<img className="discord" src="img/buttons/discord.png" alt="Join our Discord server." title="Join our Discord server."/>
						</a>
					</p>

					<p>
						Link not working? Copy this link and paste it into your regular Web browser: <span className="discord-link">{discord_url}</span>
					</p>

					<h3>GitHub</h3>
					<p>
						See the latest code, changelog, and readme information GitHub. You can also submit bug reports or feature requests.<br/>
						<a href={github_url} target="_blank" rel="noopener noreferrer">{github_url}</a>
					</p>
				</Container>
				<Container fluid className="section-container">
					<h2>Changelog</h2>
					<p>The changelog listed here will show all the changes that have been made (if any) in the current version compared against the last version you used.</p>
					<p>You can always see the latest changes and read the more detailed official changelog <a href={changelog_url} target="_blank" rel="noopener noreferrer">here.</a></p>

					<h3>Latest Changes</h3>
					{state.changelog}
				</Container>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateState : (data) => {
			dispatch(updateState(data));
		}
	}
};

export default connect(null, mapDispatchToProps)(About);