"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _commander = _interopRequireDefault(require("commander"));

var _readPkg = _interopRequireDefault(require("read-pkg"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _colorconsole = _interopRequireDefault(require("@kenworks/colorconsole"));

var _fs = require("fs");

var _path = require("path");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var dir = process.cwd();
var packageJsonPath = (0, _path.join)(dir, 'package.json');
var yarnLock = (0, _path.join)(dir, 'yarn.lock');
var excludeArgs = ['remove', '--js', '-js', '--npm', '-n', '--yarn', '--y'];

var remove = function remove(pkg, dependencies, devDependencies, useYarn) {
  var typesPkg = "@types/".concat(pkg);
  var cmd = [];

  if (dependencies[pkg]) {
    cmd.push({
      cmd: useYarn ? 'yarn' : 'npm',
      pkgName: pkg,
      args: [useYarn ? 'remove' : 'uninstall', pkg]
    });
  }

  if (devDependencies[typesPkg]) {
    cmd.push({
      cmd: useYarn ? 'yarn' : 'npm',
      pkgName: typesPkg,
      args: [useYarn ? 'remove' : 'uninstall', typesPkg]
    });
  }

  return cmd;
};

var removePkg = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pkg) {
    var pkgs, _yield$readPkg, dependencies, devDependencies, typesPkg, useYarn, cmds, _iterator, _step, cmdItem;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pkgs = _commander["default"].args.filter(function (arg) {
              return !excludeArgs.includes(arg);
            });
            _context.next = 3;
            return (0, _readPkg["default"])(packageJsonPath);

          case 3:
            _yield$readPkg = _context.sent;
            dependencies = _yield$readPkg.dependencies;
            devDependencies = _yield$readPkg.devDependencies;
            typesPkg = "@types/".concat(pkg);
            useYarn = (0, _fs.existsSync)(yarnLock);
            cmds = [];
            pkgs.forEach(function (pkg) {
              cmds = cmds.concat(remove(pkg, dependencies, devDependencies, useYarn));
            });

            if (cmds.length === 0) {
              console.log(_colorconsole["default"].text(pkg, 'red'), '、', _colorconsole["default"].text(typesPkg, 'red'), 'does not exist, please check the declaration file for redundant content');
              console.log();
            }

            _iterator = _createForOfIteratorHelper(cmds);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                cmdItem = _step.value;
                console.log('start removing', _colorconsole["default"].text(cmdItem.pkgName, 'cyan'));
                console.log();

                _crossSpawn["default"].sync(cmdItem.cmd, cmdItem.args, {
                  stdio: 'inherit'
                });
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            console.log();
            console.log("auto-type-dep: all done!");

          case 15:
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