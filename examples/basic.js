var colors = require('colors');
if (!process.env.ACS_APPKEY) {
	console.error('Please create an ACS app and set environment vars for ACS_APPKEY'.red);
	process.exit(1);
}

var ACSApp = require('../lib/acs');

console.log('Creating ACS app instance...'.cyan);
var myacsApp = new ACSApp(process.env.ACS_APPKEY);
console.log('Created: '.cyan + '%j', myacsApp);

var acsObjectList = myacsApp.getACSObjects().objectList;
console.log('Get all supported objects: myacsApp.getACSObjects().objectList'.cyan);
console.log(acsObjectList);
for (var acsObjectIndex in acsObjectList) {
	var acsObjectName = acsObjectList[acsObjectIndex];
	console.log('Get all methods in objects %s: myacsApp.getACSObjects().%s.methodList'.cyan, acsObjectName, acsObjectName);
	console.log(myacsApp.getACSObjects()[acsObjectName].methodList);
}

console.log('User logging in...'.cyan);
myacsApp.usersLogin({
	login: 'paul',
	password: 'cocoafish'
}, function(err, result) {
	if (err) {
		console.error(err);
		return;
	}
	console.log('User login request finished: '.cyan + '%j', result.body);
	console.log('Counting users via generic way myacsApp.get() instead of myacsApp.usersCount()...'.cyan);
	myacsApp.get('/v1/users/count.json', function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		console.log('User count finished: '.cyan + '%j', result.body);
		console.log('Showing current user through stored user session...'.cyan);
		myacsApp.usersShowMe(function(err, result) {
			if (err) {
				console.error(err);
				return;
			}
			console.log('User showMe request finished: '.cyan + '%j', result.body);
		});
	});
});
