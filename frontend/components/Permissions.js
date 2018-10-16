import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from  'prop-types';

const possiblePermissions = [
	'ADMIN',
	'USER',
	'ITEMCREATE',
	'ITEMUPDATE',
	'ITEMDELETE',
	'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
	query {
		users {
			id
			name
			email
			permissions
		}
	}
`;

class Permissions extends Component {
	render() {
		return (
			<Query query={ALL_USERS_QUERY}>
				{({data, loading, error }) => (
					<div>
						<Error error={error} />
						<Table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									{possiblePermissions.map(permission => 
										 <th key={permission}>{permission}</th>)}
									<th>Update</th>
								</tr>
							</thead>
							<tbody>
								{data.users.map(user => <UserPermissions key={user.id} user={user} />)}
							</tbody>
						</Table>
					</div>
				)}
			</Query>
		);
	}
}

class UserPermissions extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			name: PropTypes.string,
			email: PropTypes.string,
			id: PropTypes.string,
			permissions: PropTypes.array,
		}).isRequired,
	};

	state = {
		// Initial seed only
		permissions: this.props.user.permissions,
	}

	handlePermissionChange = (event) => {
		const checkbox = event.target;
		let updatePermissions = [...this.state.permissions];

		if (checkbox.checked) {
			updatePermissions.push(checkbox.value);
		} else {
			updatePermissions = updatePermissions.filter(permission => permission != checkbox.value);
		}

		this.setState({permissions: updatePermissions});
	};

	render() {
		const user = this.props.user;
		return (
			<tr>
				<td>{user.name}</td>
				<td>{user.email}</td>
				{possiblePermissions.map(permission => (
					<td key={permission} >
						<label htmlFor={`${user.id}-permission-${permission}`}>
							<input id={`${user.id}-permission-${permission}`}
								type="checkbox" 
								checked={this.state.permissions.includes(permission)}
								value={permission}
								onChange={this.handlePermissionChange}
								/>
						</label>
					</td>
				))}
				<td>
					<SickButton>Update</SickButton>
				</td>
			</tr>
		)
	}
}

export default Permissions;