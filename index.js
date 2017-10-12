'use strict';

import fs from 'fs';
import path from 'path';
import os from 'os';

export class awsProfileHandler {
    constructor(filePath) {
        const defaultFilePath = path.join(os.homedir(), '.aws', 'credentials');
        this.filePath = filePath || defaultFilePath;
        this.profileObject = this._parser(fs.readFileSync(this.filePath));
    }

    listProfiles() {
        return Object.keys(this.profileObject);
    }

    getProfileCredentials(profile) {
        let credentials = this.profileObject[profile];
        if (!credentials) return null;
        else return this._copy(credentials);
    }

    deleteProfile(profile) {
        let outputProfileObject = this._copy(this.profileObject);
        delete outputProfileObject[profile];
        this._writeToFile(outputProfileObject);
    }

    addProfile(profile, credentials) {
        let outputProfileObject = this._copy(this.profileObject);
        outputProfileObject[profile] = credentials;
        this._writeToFile(outputProfileObject);
    }

    _writeToFile(outputProfileObject) {
        let encodedOutput = this._buildIniFormat(outputProfileObject);
        fs.writeFileSync(this.filePath, encodedOutput, 'utf8');
    }

    _copy(object) {
        return JSON.parse(JSON.stringify(object));
    }

    _parser(rawData) {
        return;
    }

    _buildIniFormat(iniObject) {
        function _flattenObject(object) {
            let listObject = Object.keys(object).reduce((result, key) => {
                result.push(key + "=" + object[key]);
                return result;
            }, []);
            return listObject;
        }

        let littleGroup = Object.keys(iniObject).map((session) => {
            let emptyObject = {};
            emptyObject[session] = iniObject[session];
            return emptyObject;
        });

        let ok = littleGroup.reduce((iniContentList, sessionObject) => {
            let sessionName = Object.keys(sessionObject)[0];
            iniContentList.push("[" + sessionName + "]");

            let listChild = _flattenObject(sessionObject[sessionName]);
            Object.assign(iniContentList, listChild);

            iniContentList.push(""); // line break
            return iniContentList;
        }, []);
        return ok;
    }
}