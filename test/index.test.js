'use strict';
const awsProfileHandler = require('../index');

describe('awsProfileHandler unit test', () => {
    let initInstance;

    beforeEach(() => {
        initInstance = new awsProfileHandler();
    });

    test('listProfile', () => {
        let x = initInstance.listProfiles();
        expect(typeof x).toBe('object');
    })
});