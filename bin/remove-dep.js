"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _readPkg = _interopRequireDefault(require("read-pkg"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _colorconsole = _interopRequireDefault(require("@kenworks/colorconsole"));

var _fs = require("fs");

var _path = require("path");

var dir = process.cwd();
var packageJsonPath = (0, _path.join)(dir, 'package.json');
var yarnLock = (0, _path.join)(dir, 'yarn.lock');

var removePkg = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pkg) {
    var _yield$readPkg, dependencies, devDependencies, typesPkg, useYarn, cmds, _i, _cmds, cmdItem;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _readPkg["default"])(packageJsonPath);

          case 2:
            _yield$readPkg = _context.sent;
            dependencies = _yield$readPkg.dependencies;
            devDependencies = _yield$readPkg.devDependencies;
            typesPkg = "@types/".concat(pkg);
            useYarn = (0, _fs.existsSync)(yarnLock);
            cmds = [];

            if (dependencies[pkg]) {
              cmds.push({
                cmd: useYarn ? 'yarn' : 'npm',
                pkgName: pkg,
                args: [useYarn ? 'remove' : 'uninstall', pkg]
              });
            }

            if (devDependencies[typesPkg]) {
              cmds.push({
                cmd: useYarn ? 'yarn' : 'npm',
                pkgName: typesPkg,
                args: [useYarn ? 'remove' : 'uninstall', typesPkg]
              });
            }

            if (cmds.length === 0) {
              console.log('卸载失败: ', _colorconsole["default"].text(pkg, 'red'), '、', _colorconsole["default"].text(typesPkg, 'red'), '都不存在, 请检查声明文件是否有冗余内容');
              console.log();
              process.exit();
            }

            for (_i = 0, _cmds = cmds; _i < _cmds.length; _i++) {
              cmdItem = _cmds[_i];
              console.log('开始卸载: ', _colorconsole["default"].text(cmdItem.pkgName, 'cyan'));
              console.log();

              _crossSpawn["default"].sync(cmdItem.cmd, cmdItem.args, {
                stdio: 'inherit'
              });
            }

            console.log('卸载完成');
            process.exit();

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function removePkg(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = removePkg;
exports["default"] = _default;