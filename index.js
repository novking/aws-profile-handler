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
        else return this._deepCopy(credentials);
    }

    deleteProfile(profile) {
        let outputProfileObject = this._deepCopy(this.profileObject);
        delete outputProfileObject[profile];
        this._writeFile(outputProfileObject);
    }

    addProfile(profile, credentials) {
        let outputProfileObject = this._deepCopy(this.profileObject);
        outputProfileObject[profile] = credentials;
        this._writeFile(outputProfileObject);
    }

    _writeFile(outputProfileObject) {
        let encodedOutput = this._encodeIniFormat(outputProfileObject);
        fs.writeFileSync(this.filePath, encodedOutput, 'utf-8');
    }

    _deepCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }

    _parser(rawData) {
        return;
    }
}

class Ini {
    static parse(rawData) {
        let currentSection;
        let map = {};
        let lines = rawData.split(/\r?\n/);
        lines.forEach((line) => {
            // this regex will remove comments after
            // each aws profile
            line = line.split(/(^|\s)[;#]/)[0].trim();
            if (!line) return;

            let section = line.match(/^\s*\[([^\[\]]+)\]\s*$/);
            if (section) {
                currentSection = section[1];
            }
            else if (currentSection) {
                let item = line.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
                if (item) {
                    map[currentSection] = map[currentSection] || {};
                    map[currentSection][item[1]] = item[2];
                } else {
                    throw new Error('Invalid ini structure');
                }
            }
        });
        return lines;
    }

    _encodeIniFormat(iniObject) {
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

class Utils {

}