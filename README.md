# aws-profile-handler
Simply tool for extracting and editing the .aws/credentials
You can listProfiles, getProfileCredentials, deleteProfile, and addProfile.

[![Build Status](https://travis-ci.org/novking/aws-profile-handler.svg?branch=master)](https://travis-ci.org/novking/aws-profile-handler)
[![Coverage Status](https://coveralls.io/repos/github/novking/aws-profile-handler/badge.svg?branch=master)](https://coveralls.io/github/novking/aws-profile-handler?branch=master)
[![GitHub license](https://img.shields.io/github/license/novking/aws-profile-handler.svg)](https://github.com/novking/aws-profile-handler/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/novking/aws-profile-handler.svg)](https://github.com/novking/aws-profile-handler/issues)
[![Maintainability](https://api.codeclimate.com/v1/badges/d3c0ab7cf85434db1e2c/maintainability)](https://codeclimate.com/github/novking/aws-profile-handler/maintainability)
[![dependencies Status](https://david-dm.org/novking/aws-profile-handler/status.svg)](https://david-dm.org/novking/aws-profile-handler)
[![npm version](https://badge.fury.io/js/aws-profile-handler.svg)](https://badge.fury.io/js/aws-profile-handler)

## How do I install it?

Install it as an npm package

```bash
npm install aws-profile-handler
```

## Initialization

```javascript
const awsProfileHandler = require('aws-profile-handler');

// default to ~/.aws/credential. 
let awsProfiler = new awsProfileHandler();

// can be customized file
let awsProfiler = new awsProfileHandler('path/to/aws/credentials');
```

## Add a profile

```javascript
let valid_credential_object = {
        "aws_access_key_id": "123",
        "aws_secret_access_key": "456"
};
awsProfiler.addProfile('awesomeProfileName', valid_credential_object);

// .aws/credentials
[awesomeProfileName]
aws_access_key_id=123
aws_secret_access_key=456
```

## Get a profile's credentials

```javascript
awsProfiler.getProfileCredentials('awesomeProfileName');

// return null if profile doesn't exist
// return an object with 'aws_access_key_id' and 'aws_access_key_id'
{
    "aws_access_key_id": "123",
    "aws_secret_access_key": "456"
}
```

## List profiles

```javascript
awsProfiler.listProfiles();

// return a list of all the profiles' name
['awesomeProfileName', 'something', 'else', 'if', 'exists'];
```

## Delete a profile

```javascript
awsProfiler.deleteProfile('awesomeProfileName');
```