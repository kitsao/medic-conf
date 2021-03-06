const { assert, expect } = require('chai');
const compileAppSettings = require('../../src/fn/compile-app-settings');
const fs = require('../../src/lib/sync-fs');

describe('compile-app-settings', () => {

  it('should handle simple config', () =>
    test('simple/project'));

  it('should handle derivative app-settings definitions', () =>
    test('derivative/child'));

  it('should handle nools & contact-summary templating', () =>
    test('templating/project'));

  it('should handle config with no separate task-schedules.json file', () =>
    test('no-task-schedules.json/project'));

  it('should handle config with combined targets.js definition', () =>
    test('targets.js/project'));

  it('should reject a project with both old and new nools config', () =>
    testFails('unexpected-legacy-nools-rules/project'));

  it('should handle a project with a purge function', () =>
    test('purging-function/project'));

  it('should handle a project with a perge function that need to be merged with other purge config', () =>
    test('purging-function/project'));

  it('should reject a project with an uncompilable purging function', () =>
    testFails('invalid-purging-function/project'));
});

function test(relativeProjectDir) {
  const testDir = `./data/compile-app-settings/${relativeProjectDir}`;

  // when
  return compileAppSettings(testDir)

    .then(() => {
      // then
      const actual = JSON.parse(fs.read(`${testDir}/app_settings.json`));
      const expected = JSON.parse(fs.read(`${testDir}/../app_settings.expected.json`));
      actual.tasks.rules = expected.tasks.rules = '';
      expect(actual).to.deep.eq(expected);
    });
}

function testFails(relativeProjectDir) {
  const testDir = `./data/compile-app-settings/${relativeProjectDir}`;

  // when
  return compileAppSettings(testDir)
    .then(() => assert.fail('Expected compileAppSettings() to fail, but it didn\'t.'))
    .catch(e => {
      if(e.name === 'AssertionError') throw e;
      assert.ok(e);
    });
}
