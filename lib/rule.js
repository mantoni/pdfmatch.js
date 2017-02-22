/*eslint-disable strict, no-eval, no-sync*/
const child_process = require('child_process');
const xtend = require('xtend');
const text_match = require('text-match');

module.exports = function (config, text, context, argv) {
  const match = text_match.matcher(config.match);
  const values = match(text);
  if (values) {
    const vars = xtend(values, context); // eslint-disable-line no-unused-vars
    const command = config.command.replace(/\${[^}]+}/g, (_) => {
      const script = _.substring(2, _.length - 1);
      return eval(`(function () {
        with (vars) {
          return ${script};
        }
      })()`);
    });
    console.info(`> ${command}`);
    if (!argv || !argv.debug) {
      const output = child_process.execSync(command);
      if (output) {
        process.stdout.write(output);
      }
    }
    return true;
  }
  return false;
};
