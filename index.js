'use strict';

const path = require('path');
const os = require('os');
const Ini = require('./lib/ini');
const Utils = require('./lib/utils');
const defaultFilePath = path.join(os.homedir(), '.aws', 'credentials');

class awsProfileHandler {
    /**
     * @deprecated
     * @param filePath
     */
    constructor(filePath) {
        const defaultFilePath = path.join(os.homedir(), '.aws', 'credentials');
        this.filePath = filePath || defaultFilePath;
        this.profileObject = Ini.decodeIniData(Utils.readFile(this.filePath));
    }

    /**
     * @deprecated
     * @return {Array}
     */
    listProfiles() {
        return Object.keys(this.profileObject);
    }

    /**
     * @deprecated
     * @param profile
     * @return {*}
     */
    getProfileCredentials(profile) {
        let credentials = this.profileObject[profile];
        if (!credentials) return null;
        else return Utils.deepCopy(credentials);
    }

    /**
     * @deprecated
     * @param profile
     */
    deleteProfile(profile) {
        let outputProfileObject = Utils.deepCopy(this.profileObject);
        delete outputProfileObject[profile];
        let encodedProfile = Ini.encodeIniFormat(outputProfileObject);
        console.log(this.filePath);
        console.log(encodedProfile);
        Utils.writeFile(this.filePath, encodedProfile);
    }

    /**
     * @deprecated
     * @param profile
     * @param credentials
     */
    addProfile(profile, credentials) {
        let outputProfileObject = Utils.deepCopy(this.profileObject);
        outputProfileObject[profile] = credentials;
        let encodedProfile = Ini.encodeIniFormat(outputProfileObject);
        Utils.writeFile(this.filePath, encodedProfile);
    }

    static listProfiles(filePath) {
        let credentialPath = filePath || defaultFilePath;
        let profileObject = Ini.decodeIniData(Utils.readFile(credentialPath));

        return Object.keys(profileObject);
    }

    static getProfileCredentials(profile, filePath) {
        let credentialPath = filePath || defaultFilePath;
        let profileObject = Ini.decodeIniData(Utils.readFile(credentialPath));

        let credentials = profileObject[profile];
        if (!credentials) return null;
        else return Utils.deepCopy(credentials);
    }

    static deleteProfile(profile, filePath) {
        let credentialPath = filePath || defaultFilePath;
        let profileObject = Ini.decodeIniData(Utils.readFile(credentialPath));

        let outputProfileObject = Utils.deepCopy(profileObject);
        delete outputProfileObject[profile];
        let encodedProfile = Ini.encodeIniFormat(outputProfileObject);
        Utils.writeFile(filePath, encodedProfile);
    }

    static addProfile(profile, credentials, filePath) {
        let credentialPath = filePath || defaultFilePath;
        let profileObject = Ini.decodeIniData(Utils.readFile(credentialPath));

        let outputProfileObject = Utils.deepCopy(profileObject);
        outputProfileObject[profile] = credentials;
        let encodedProfile = Ini.encodeIniFormat(outputProfileObject);
        Utils.writeFile(filePath, encodedProfile);
    }
}
module.exports = awsProfileHandler;


