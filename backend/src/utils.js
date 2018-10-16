/*

Look for permissions overlap 

// user
{
	name: Richard
	permissions: ['ADMIN', 'ITEMUPDATE']
}

['PERMISSIONUPDATE', 'ADMIN']

*/

function hasPermission(user, permissionsNeeded) {
	// Do the permissions they currently have include what they are asking for?
	const matchedPermissions = user.permissions.filter(permissionTheyHave =>
		permissionsNeeded.includes(permissionTheyHave)
	);

	if (!matchedPermissions.length) {
		throw new Error(`You do not have sufficient permissions

			: ${permissionsNeeded}

			You Have:

			${user.permissions}
			`);
	}
}

exports.hasPermission = hasPermission;
