"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _commander = _interopRequireDefault(require("commander"));

var _which = _interopRequireDefault(require("which"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _colorconsole = _interopRequireDefault(require("@kenworks/colorconsole"));

var _npmPackageArg = _interopRequireDefault(require("npm-package-arg"));

var _ini = _interopRequireDefault(require("ini"));

var _https = require("https");

var _path = require("path");

var _fs = require("fs");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var dir = process.cwd();
var yarnLock = (0, _path.join)(dir, 'yarn.lock'); //  解析.npmrc中的内容变成一个对象

var npmRc = (0, _path.join)(process.env.USERPROFILE || process.env.HOME, '.npmrc');
var npmRcBuffer = (0, _fs.readFileSync)(npmRc, 'utf-8');

var npmConfig = _ini["default"].parse(npmRcBuffer);

var excludeArgs = ['add', '--js', '-js', '--npm', '-n', '--yarn', '--y']; //  拼凑出包名的完整路径

var packageUrl = function packageUrl(pkg) {
  var originUrl = npmConfig.registry || 'https://www.npmjs.com/package/';

  if (!originUrl.endsWith('/')) {
    originUrl = "".concat(originUrl, "/");
  }

  return "".concat(originUrl).concat(pkg);
}; //  搜索该包是否存在当前镜像


var searchPackage = function searchPackage(pkg) {
  var url = packageUrl(pkg);
  return new Promise(function (resolve, reject) {
    (0, _https.get)(url, function (res) {
      if (res.statusCode === 404) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).on('error', function (e) {
      resolve(false);
    });
  });
};

var commandExist = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(cmd) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _which["default"])(cmd);

          case 3:
            return _context.abrupt("return", true);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", false);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));

  return function commandExist(_x) {
    return _ref.apply(this, arguments);
  };
}();

var installPkg = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(pkg, opt) {
    var parsed, packageExist, typesPkg, isTypeScript, needVersion, finalCmd, isYarn, typeExist, cmds, _i, _cmds, cmdItem;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            parsed = (0, _npmPackageArg["default"])(pkg);
            _context2.next = 3;
            return searchPackage(parsed.name);

          case 3:
            packageExist = _context2.sent;
            typesPkg = "@types/".concat(parsed.name);
            isTypeScript = !opt.js;
            needVersion = parsed.rawSpec === parsed.fetchSpec;
            pkg = parsed.name;

            if (!packageExist) {
              console.log(_colorconsole["default"].text("".concat(pkg, " \u4E0D\u5B58\u5728,\u8BF7\u5207\u6362\u955C\u50CF\u6E90\u6216\u8005\u68C0\u67E5\u5305\u540D\u662F\u5426\u6B63\u786E\u540E\u91CD\u8BD5"), 'red'));
              process.exit();
            }

            cmds = []; //  指定了npm就用npm安装, 否则优先使用yarn安装

            if (opt.npm) {
              if (opt.npmExist) {
                finalCmd = 'npm';
              } else if (opt.yarnExist) {
                finalCmd = 'yarn';
              } else {
                process.exit();
              }
            } else if (opt.yarn) {
              if (opt.yarnExist) {
                finalCmd = 'yarn';
              } else if (opt.npmExist) {
                finalCmd = 'npm';
              } else {
                process.exit();
              }
            } else {
              if (opt.useYarn) {
                finalCmd = 'yarn';
              } else {
                finalCmd = 'npm';
              }
            }

            isYarn = finalCmd === 'yarn';
            cmds.push({
              cmd: finalCmd,
              pkgName: needVersion ? "".concat(pkg, "@").concat(parsed.fetchSpec) : pkg,
              args: [isYarn ? 'add' : 'install', needVersion ? "".concat(pkg, "@").concat(parsed.fetchSpec) : pkg]
            });

            if (!isTypeScript) {
              _context2.next = 18;
              break;
            }

            _context2.next = 16;
            return searchPackage(typesPkg);

          case 16:
            typeExist = _context2.sent;

            if (typeExist) {
              cmds.push({
                cmd: finalCmd,
                pkgName: typesPkg,
                args: [isYarn ? 'add' : 'install', typesPkg, isYarn ? '--dev' : '--save-dev']
              });
            }

          case 18:
            for (_i = 0, _cmds = cmds; _i < _cmds.length; _i++) {
              cmdItem = _cmds[_i];
              console.log();
              console.log('开始安装: ', _colorconsole["default"].text(cmdItem.pkgName, 'cyan'));
              console.log();

              _crossSpawn["default"].sync(cmdItem.cmd, cmdItem.args, {
                stdio: 'inherit'
              });
            }

            if (isTypeScript && !typeExist) {
              console.log();
              console.log(_colorconsole["default"].text("@types/".concat(pkg), 'red'), '未找到, 请自行编写声明文件');
            }

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function installPkg(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var installDep = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(pkg, opt) {
    var pkgs, yarnExist, npmExist, useYarn, _iterator, _step, _pkg;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            pkgs = _commander["default"].args.filter(function (arg) {
              return !excludeArgs.includes(arg);
            });
            _context3.next = 3;
            return commandExist('yarn');

          case 3:
            yarnExist = _context3.sent;
            _context3.next = 6;
            return commandExist('npm');

          case 6:
            npmExist = _context3.sent;
            useYarn = (0, _fs.existsSync)(yarnLock);
            _iterator = _createForOfIteratorHelper(pkgs);
            _context3.prev = 9;

            _iterator.s();

          case 11:
            if ((_step = _iterator.n()).done) {
              _context3.next = 17;
              break;
            }

            _pkg = _step.value;
            _context3.next = 15;
            return installPkg(_pkg, _objectSpread({}, opt, {
              yarnExist: yarnExist,
              npmExist: npmExist,
              useYarn: useYarn
            }));

          case 15:
            _context3.next = 11;
            break;

          case 17:
            _context3.next = 22;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](9);

            _iterator.e(_context3.t0);

          case 22:
            _context3.prev = 22;

            _iterator.f();

            return _context3.finish(22);

          case 25:
            console.log();
            console.log('安装完成');
            process.exit();

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[9, 19, 22, 25]]);
  }));

  return function installDep(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = installDep;
exports["default"] = _default;