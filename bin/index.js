#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _commander = _interopRequireDefault(require("commander"));

var _colorconsole = _interopRequireDefault(require("@kenworks/colorconsole"));

var _installDep = _interopRequireDefault(require("./install-dep"));

var _removeDep = _interopRequireDefault(require("./remove-dep"));

var pkg = require('../package.json');

var showTip = function showTip(cmd) {
  if (!cmd) {
    if (process.argv.length < 3) {
      console.log();
      console.log('Please specify subcommand and package name');
      console.log(_colorconsole["default"].text('auto-type-dep add', 'cyan'), _colorconsole["default"].text('<pkg>[@version] [options]', 'green'));
      console.log();
      console.log(_colorconsole["default"].text('auto-type-dep remove', 'cyan'), _colorconsole["default"].text('<pkg>', 'green'));
      console.log();
      process.exit();
    }
  } else {}
};

showTip();

_commander["default"].command('help', null, {
  noHelp: true
});

_commander["default"].helpInformation = function () {
  console.log("\n  ".concat(_colorconsole["default"].text('Commands:', 'yellow'), "\n\n  \u25CF ").concat(_colorconsole["default"].text('add <pkg>[@version] [option]', 'green'), "\n    Install the specified dependencies and @types, specify the version via @x.y.z\n  \n    ").concat(_colorconsole["default"].text('Option:', 'cyan'), "\n      ").concat(_colorconsole["default"].text('-n, --npm', 'magenta'), "    Specify install dependencies via npm\n      ").concat(_colorconsole["default"].text('-y, --yarn', 'magenta'), "   Specify install dependencies via yarn\n      ").concat(_colorconsole["default"].text('-js, --js', 'magenta'), "    Specify that this is a js project, only install <pkg>, not install @types\n\n  \u25CF ").concat(_colorconsole["default"].text('remove <pkg>', 'green'), "\n    Uninstall the specified dependencies and @types, automatically find them from the package.json under the project, and uninstall if they exist\n  "));
  return '';
};

_commander["default"].version(pkg.version);

_commander["default"].command('add <pkg>').description('Install the specified dependencies and@types').option('-n, --npm', 'Specify install dependencies via npm').option('-y, --yarn', 'Specify install dependencies via yarn').option('-js, --js', 'Specify that this is a js project, only install <pkg>, not install @types').action(_installDep["default"]);

_commander["default"].command('remove <pkg>').description('Uninstall the specified dependencies and @types').action(_removeDep["default"]);

_commander["default"].option('-h, --help', 'Docs');

try {
  _commander["default"].parse(process.argv);
} catch (err) {
  console.log(err);
  console.log('View Docs via', _colorconsole["default"].text('auto-type-dep --help', 'cyan'));
  process.exit();
}