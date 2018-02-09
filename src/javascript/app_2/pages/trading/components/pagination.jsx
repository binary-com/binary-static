import React from 'react';

class Pagination extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			current: this.props.current
		};
	}

	render() {
		return (
			<ul>
				<li><a>prev</a></li>
				<li><a>next</a></li>
			</ul>
		);
	}
}

Pagination.defaultProps = {
	total: 0,
	pageSize: 10
};

export default Pagination;
