/*eslint-disable strict, no-eval, no-sync*/

const child_process = require('child_process');

module.exports = function (command, vars, argv) {
  const cmd = command.replace(/\${[^}]+}/g, (_) => {
    const script = _.substring(2, _.length - 1);
    return eval(`(function () {
      with (vars) {
        return ${script};
      }
    })()`);
  });
  console.info(`> ${cmd}`);
  if (!argv || !argv.debug) {
    const output = child_process.execSync(cmd);
    if (output) {
      process.stdout.write(output);
    }
  }
};
