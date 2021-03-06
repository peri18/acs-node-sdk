# ACS Node SDK [![Build Status](https://travis-ci.org/realpaul/acs-node-sdk.svg)](https://travis-ci.org/realpaul/acs-node-sdk)

The SDK of ACS for NodeJS

## Getting started

```bash
git clone git+https://github.com/appcelerator/acs-node-sdk.git
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
var ACSNode = require('acs-node');
var acsApp = new ACSNode('Your_ACS_APPKEY');

acsApp.usersLogin({
    login: ACS_USERNAME,
    password: ACS_PASSWORD
}, function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Logged in user: %j', result.body);
    acsApp.usersShowMe(function(err, result) {
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
var acsApp = new ACSNode('Your_ACS_APPKEY');

acsApp.usersLogin({
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
var ACSNode = require('acs-node');
var acsApp = new ACSNode('Your_ACS_APPKEY');

acsApp.usersShowMe(ACS_APPKEY, {
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
var acsApp = new ACSNode('Your_ACS_APPKEY');

acsApp.post(ACS_APPKEY, '/v1/users/login.json', {
    login: ACS_USERNAME,
    password: ACS_PASSWORD
}, function(err, result) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('ACS returned body: %j', result.body);
    console.log('Cookie string returned: %s', result.cookieString);

    acsApp.get(ACS_APPKEY, '/v1/users/show/me.json', function(err, result) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('ACS returned user: %j', result.body);
    });
});
```

## Session Management

By default, acs-node-sdk will manage sessions for you automatically when you
log in and out. You can create a new `ACSNode` instance for each authenticated
session. You can also reuse an existing instance by calling `usersLogin()` again,
however this simply overwrites the existing session cookie and will not log out
the previous session.

However, if you'd prefer to manually manage the session cookie, then you can set
the `autoSessionManagement` option to `false` when the `ACSNode` instance is
created.

```javascript
var acsApp = new ACSNode('Your_ACS_APPKEY', {
    autoSessionManagement: false
});
```

This means once you log in, you must track the session cookie yourself:

```javascript
acsApp.usersLogin({
    login: ACS_USERNAME,
    password: ACS_PASSWORD
}, function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    
    console.log('Logged in user');
    console.log('Cookie string returned: %s', result.cookieString);
    
    // IMPORTANT! You must set the sessionCookieString or else all privileged calls will fail
    acsApp.sessionCookieString = result.cookieString;
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
