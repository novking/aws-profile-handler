'use strict';

jest.mock('../lib/ini');
jest.mock('../lib/utils');
const awsProfileHandler = require('../index');
const Ini = require('../lib/ini');
const Utils = require('../lib/utils');
const path = require('path');
const os = require('os');

let initInstance;
let testingObject;
let addedObject = {
    "add": {
        "a": "a",
        "b": "b"
    }
};
let childObject = {
    "default": {
        "key1": "val1",
        "key2": "val2"
    }
};

describe('V2 awsProfileHandler unit test', () => {
    beforeEach(() => {
        testingObject = {
            "default": childObject.default,
            "awesome": {
                "aaron": "that's me"
            }
        };

        Utils.readFile.mockReturnValue(null);
        Ini.decodeIniData.mockReturnValue(testingObject);
        Utils.deepCopy.mockImplementation((object) => {
            return JSON.parse(JSON.stringify(object))
        });
    });

    describe('listProfile', () => {
        test('with default credentials path', () => {
            const defaultFilePath = path.join(os.homedir(), '.aws', 'credentials');
            let result = awsProfileHandler.listProfiles();
            expect(Utils.readFile).toBeCalledWith(defaultFilePath);
            expect(Ini.decodeIniData).toBeCalled();
            expect(result).toEqual(['default', 'awesome']);
        });
        test('with customized credentials path', () => {
            const customFilePath = "custom/file/path";
            let result = awsProfileHandler.listProfiles(customFilePath);
            expect(Utils.readFile).toBeCalledWith(customFilePath);
            expect(Ini.decodeIniData).toBeCalled();
            expect(result).toEqual(['default', 'awesome']);
        });
    });

    describe('getProfileCredentials', () => {
        test('cannot find the profile', () => {
            let result = awsProfileHandler.getProfileCredentials("empty");
            expect(result).toBe(null);
        });

        test('find the profile', () => {
            let result = awsProfileHandler.getProfileCredentials("default");
            expect(result).toEqual(childObject.default);
        });
    });

    test('deleteProfile', () => {
        awsProfileHandler.deleteProfile("awesome");
        expect(Ini.encodeIniFormat)
            .toBeCalledWith(childObject);
        expect(Utils.writeFile).toBeCalled();
    });

    test('addProfile', () => {
        let expected_result = {
            "default": childObject.default,
            "awesome": {
                "aaron": "that's me"
            },
            "add": addedObject.add
        };
        awsProfileHandler.addProfile("add", addedObject.add);
        expect(Utils.writeFile).toBeCalled();
        expect(Ini.encodeIniFormat)
            .toBeCalledWith(expected_result);
    })
});

describe('awsProfileHandler unit test', () => {
    beforeEach(() => {
        testingObject = {
            "default": childObject.default,
            "awesome": {
                "aaron": "that's me"
            }
        };

        Utils.readFile.mockReturnValue(null);
        Ini.decodeIniData.mockReturnValue(testingObject);
        Utils.deepCopy.mockImplementation((object) => {
            return JSON.parse(JSON.stringify(object))
        });
        initInstance = new awsProfileHandler('amazing/package');
    });

    describe('test instance setup (constructor)', () => {
        it('default path', () => {
            const defaultFilePath = path.join(os.homedir(), '.aws', 'credentials');
            new awsProfileHandler();
            expect(Utils.readFile).toBeCalledWith(defaultFilePath);
            expect(Ini.decodeIniData).toBeCalled();
        });

        it('custom file path', () => {
            const customFilePath = "custom/file/path";
            new awsProfileHandler(customFilePath);
            expect(Utils.readFile).toBeCalledWith(customFilePath);
            expect(Ini.decodeIniData).toBeCalled();
        });

        it('has decode error', () => {
            Utils.readFile.mockReturnValue(null);
            Ini.decodeIniData.mockImplementation(() => {
                throw new Error();
            });
            let errorThrowingFunction = () => {
                new awsProfileHandler();
            };
            expect(errorThrowingFunction).toThrow();
        });
    });

    test('listProfile', () => {
        let result = initInstance.listProfiles();
        expect(result).toEqual(['default', 'awesome']);
    });

    describe('getProfileCredentials', () => {
        test('cannot find the profile', () => {
            let result = initInstance.getProfileCredentials("empty");
            expect(result).toBe(null);
        });

        test('find the profile', () => {
            let result = initInstance.getProfileCredentials("default");
            expect(result).toEqual(childObject.default);
        });
    });

    test('deleteProfile', () => {
        initInstance.deleteProfile("awesome");
        expect(Ini.encodeIniFormat)
           .toBeCalledWith(childObject);
        expect(Utils.writeFile).toBeCalled();
    });

    test('addProfile', () => {
        let expected_result = {
            "default": childObject.default,
            "awesome": {
                "aaron": "that's me"
            },
            "add": addedObject.add
        };
        initInstance.addProfile("add", addedObject.add);
        expect(Utils.writeFile).toBeCalled();
        expect(Ini.encodeIniFormat)
            .toBeCalledWith(expected_result);
    })
});