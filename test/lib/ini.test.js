'use strict';

const Ini = require('../../lib/ini');

describe('Ini module unit test', () => {
    const iniObjectFormat = {
        'default': {
            'key': '123',
            'value': '321'
        },
        'test': {
            'key': '12345',
            'value': '12345'
        }
    };

    const iniTextFormat =
        "[default]\n" +
        "key=123\n" +
        "value=321\n" +
        "\n" +
        "[test]\n" +
        "key=12345\n" +
        "value=12345\n" +
        "";

    const incompeletedKeyPair =
        "[default]\n" +
        "key=123\n" +
        "value=\n" +
        "\n" +
        "[test]\n" +
        "key=12345\n" +
        "value=12345\n" +
        "";

    const nestedSession =
        "[default]\n" +
        "[nested]\n" +
        "key=123\n" +
        "value=\n" +
        "\n" +
        "[test]\n" +
        "key=12345\n" +
        "value=12345\n" +
        "";


    const emptyFile = "";

    const whiteSpaceFile = "\n\t\r   \n";

    const emptyInitObject = {};


    describe('encodeIniFormat', () => {
        it('happy case', () => {
            let encodedResult = Ini.encodeIniFormat(iniObjectFormat);
            expect(encodedResult).toEqual(iniTextFormat);
        });

        it('empty object', () => {
            let encodedResult = Ini.encodeIniFormat(emptyInitObject);
            expect(encodedResult).toEqual("");
        });
    });


    describe('decodeInitData', () => {
        it('happy case', () => {
            let decodedResult = Ini.decodeIniData(iniTextFormat);
            expect(decodedResult).toEqual(iniObjectFormat);
        });

        it('incomplete key-value pair error', () => {
            function invalidContent() {
                return Ini.decodeIniData(incompeletedKeyPair);
            }
            expect(invalidContent)
                .toThrowError('Invalid AWS credential file. Incomplete key/value pair');
        });

        it('nested sessions error', () => {
            function invalidContent() {
                return Ini.decodeIniData(nestedSession);
            }
            expect(invalidContent)
                .toThrowError('Invalid AWS credential file. Cannot have nested sessions');
        });

        it('empty file should return empty object', () => {
            let decodedResult = Ini.decodeIniData(emptyFile);
            expect(decodedResult).toEqual({});
        });

        it('\'white spaces only\' file should return empty object', () => {
            let decodedResult = Ini.decodeIniData(whiteSpaceFile);
            expect(decodedResult).toEqual({});
        });
    });

    describe('_emptyCheck', () => {
        it('should return true if the input array is empty', () => {
            let input_array = [];
            expect(Ini._emptyCheck(input_array)).toEqual(true);
        });

        it('should return false if the input array has at least one non-whitespace', () => {
            let input_array = ['\n\n', '\t', '  ', 'done'];
            expect(Ini._emptyCheck(input_array)).toEqual(false);
        });

        it('should return true if the input array only has whitespace array', () => {
            let input_array = ['\n\n', '\t', '  ', ''];
            expect(Ini._emptyCheck(input_array)).toEqual(true);
        });
    })
});

