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

    describe('encodeIniFormat', () => {
        it('happy case', () => {
            let encodedResult = Ini.encodeIniFormat(iniObjectFormat);
            expect(encodedResult).toEqual(iniTextFormat);
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
                .toThrowError('Invalid credential file. Incomplete key/value pair');
        });

        it('nested sessions error', () => {
            function invalidContent() {
                return Ini.decodeIniData(nestedSession);
            }
            expect(invalidContent)
                .toThrowError('Invalid credential file. Cannot have nested sessions');
        });
    });
});

