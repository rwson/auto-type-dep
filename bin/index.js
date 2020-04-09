#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _commander = _interopRequireDefault(require("commander"));

var _colorconsole = _interopRequireDefault(require("@kenworks/colorconsole"));

var _installDep = _interopRequireDefault(require("./install-dep"));

var _removeDep = _interopRequireDefault(require("./remove-dep"));

var showTip = function showTip(cmd) {
  if (!cmd) {
    if (process.argv.length < 3) {
      console.log();
      console.log('请指定子命令以及包名: ');
      console.log(_colorconsole["default"].text('auto-type-dep add', 'cyan'), _colorconsole["default"].text('<pkg> [options]', 'green'));
      console.log();
      console.log(_colorconsole["default"].text('auto-type-dep remove', 'cyan'), _colorconsole["default"].text('<pkg>', 'green'));
      console.log();
      console.log('通过', _colorconsole["default"].text('auto-type-dep --help', 'cyan'), '查看帮助文档');
      process.exit();
    }
  } else {}
};

showTip();

_commander["default"].command('help', null, {
  noHelp: true
});

_commander["default"].helpInformation = function () {
  console.log("\n  ".concat(_colorconsole["default"].text('Commands:', 'yellow'), "\n\n  \u25CF ").concat(_colorconsole["default"].text('add <pkg> [option]', 'green'), " \u5B89\u88C5\u6307\u5B9A\u7684\u4F9D\u8D56\u4EE5\u53CA@types\n  \n    ").concat(_colorconsole["default"].text('Option:', 'cyan'), "\n      ").concat(_colorconsole["default"].text('-n, --npm', 'magenta'), "       \u6307\u5B9A\u7528npm\u6765\u5B89\u88C5\u4F9D\u8D56\n      ").concat(_colorconsole["default"].text('-y, --yarn', 'magenta'), "      \u6307\u5B9A\u7528yarn\u6765\u5B89\u88C5\u4F9D\u8D56\n      ").concat(_colorconsole["default"].text('-js, --js', 'magenta'), "       \u6307\u5B9A\u8FD9\u662F\u4E00\u4E2Ajs\u9879\u76EE, \u53EA\u5B89\u88C5<pkg>, \u4E0D\u5B89\u88C5@types\n\n  \u25CF ").concat(_colorconsole["default"].text('remove <pkg>', 'green'), "      \u5378\u8F7D\u6307\u5B9A\u7684\u4F9D\u8D56\u4EE5\u53CA@types, \u81EA\u52A8\u4ECE\u9879\u76EE\u4E0B\u7684package.json\u4E2D\u67E5\u627E, \u5982\u679C\u5B58\u5728, \u5C31\u5378\u8F7D\n  "));
  return '';
};

_commander["default"].version('1.0.0');

_commander["default"].command('add <pkg>').description('安装指定的依赖以及@types').option('-n, --npm', '指定用npm来安装依赖').option('-y, --yarn', '指定用yarn来安装依赖').option('-js, --js', '指定这是一个js项目, 只安装<pkg>, 不安装@types').action(_installDep["default"]);

_commander["default"].command('remove <pkg>').description('卸载指定的依赖以及@types').action(_removeDep["default"]);

_commander["default"].option('-h, --help', '帮助文档');

try {
  _commander["default"].parse(process.argv);
} catch (err) {
  console.log(err);
  console.log('通过', _colorconsole["default"].text('auto-type-dep --help', 'cyan'), '查看帮助文档');
  process.exit();
}