'use strict';

const path = require('path');
const os = require('os');
const Ini = require('./lib/ini');
const Utils = require('./lib/utils');

class awsProfileHandler {
    constructor(filePath) {
        const defaultFilePath = path.join(os.homedir(), '.aws', 'credentials');
        this.filePath = filePath || defaultFilePath;
        try {
            this.profileObject = Ini.decodeIniData(Utils.readFile(this.filePath));
        } catch (err) {
            throw err;
        }
    }

    listProfiles() {
        return Object.keys(this.profileObject);
    }

    getProfileCredentials(profile) {
        let credentials = this.profileObject[profile];
        if (!credentials) return null;
        else return Utils.deepCopy(credentials);
    }

    deleteProfile(profile) {
        let outputProfileObject = Utils.deepCopy(this.profileObject);
        delete outputProfileObject[profile];
        let encodedProfile = Ini.encodeIniFormat(this.filePath, outputProfileObject);
        Utils.writeFile(encodedProfile);
    }

    addProfile(profile, credentials) {
        let outputProfileObject = Utils.deepCopy(this.profileObject);
        outputProfileObject[profile] = credentials;
        let encodedProfile = Ini.encodeIniFormat(this.filePath, outputProfileObject);
        Utils.writeFile(encodedProfile);
    }
}
module.exports = awsProfileHandler;


