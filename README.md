# ACS Node SDK [![Build Status](https://travis-ci.org/realpaul/acs-node-sdk.svg)](https://travis-ci.org/realpaul/acs-node-sdk)

The SDK of ACS for NodeJS

## Getting started
```bash
git clone git@github.com:realpaul/acs-node-sdk.git
cd acs-node-sdk
npm install
```

## Basic Example
You can get an overview of ACS Node SDK example from examples/basic.js
```bash
cd acs-node-sdk/examples
export ACS_APPKEY=YOUR_ACS_TEST_APPKEY
node basic.js
```

## ACS Node SDK Example on Node.ACS
There is another example for ACS Node SDK to show how to run on Node.ACS as a service.
Make sure you have installed Node.ACS command line tool first:
```bash
sudo npm -g install acs
```
Then you can try:
```bash
cd acs-node-sdk/examples/over_nodeacs
# Update config.json to fill in your ACS app key
vi config.json
acs run
```
Open another session and try:
```bash
curl -b cookie.txt -c cookie.txt -X POST -F "login=YOUR_USERNAME" -F "password=YOUR_PASSWORD" http://localhost:8080/login
curl -b cookie.txt -c cookie.txt -X GET http://localhost:8080/showMe
```

# ACS Node SDK Basic Usage
## Use ACS Node SDK directly
```javascript
var ACSApp = require('acs-node');
var myacsApp = new ACSApp('Your_ACS_APPKEY');

// Cookie string can be passed into too
// var acsApp = require('acs-node')('Your_ACS_APPKEY', {
//     apiEntryPoint: 'https://api.cloud.appcelerator.com',
//     cookieString: req.session.cookieString
// });
myacsApp.usersLogin({
    login: ACS_USERNAME,
    password: ACS_PASSWORD
}, function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Logged in user: %j', result.body);
    myacsApp.setSessionByCookieString(result.cookieString);
    myacsApp.usersShowMe(function(err, result) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Show user: %j', result.body);
    });
});
```

## Use ACS Node SDK inner express or http/https NodeJS module
```javascript
// HTTP call 1 with cookie:
var ACSApp = require('acs-node');
var myacsApp = new ACSApp('Your_ACS_APPKEY');

myacsApp.usersLogin(ACS_APPKEY, {
    login: req.body.login,
    password: req.body.password,
    req: req,
    res: res
}, function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    res.end(result.body);
});

// HTTP call 2 with cookie, after HTTP call 1:
var ACSApp = require('acs-node');
var myacsApp = new ACSApp('Your_ACS_APPKEY');

myacsApp.usersShowMe(ACS_APPKEY, {
    req: req,
    res: res
}, function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    res.end(result.body);
});
```

## General RestAPI call
```javascript
var ACSApp = require('acs-node');
var myacsApp = new ACSApp('Your_ACS_APPKEY');

myacsApp.post(ACS_APPKEY, '/v1/users/login.json', {
    login: ACS_USERNAME,
    password: ACS_PASSWORD
}, function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('ACS returned body: %j', result.body);
    console.log('Cookie string returned: %s', result.cookieString);
    myacsApp.setSessionByCookieString(result.cookieString);
    myacsApp.get(ACS_APPKEY, '/v1/users/show/me.json', function(err, result) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('ACS returned user: %j', result.body);
    });
});
```

## Running Unit Tests

To run the unit tests, simply run:

    export ACS_APPKEY=ONE_OF_YOUR_ACS_TEST_APPKEY
    npm test

## License

This project is open source and provided under the Apache Public License
(version 2). Please make sure you see the `LICENSE` file included in this
distribution for more details on the license.  Also, please take notice of the
privacy notice at the end of the file.

#### (C) Copyright 2012-2014, [Appcelerator](http://www.appcelerator.com/) Inc. All Rights Reserved.
