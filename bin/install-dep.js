"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _which = _interopRequireDefault(require("which"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _colorconsole = _interopRequireDefault(require("@kenworks/colorconsole"));

var _ini = _interopRequireDefault(require("ini"));

var _https = require("https");

var _path = require("path");

var _fs = require("fs");

var dir = process.cwd();
var yarnLock = (0, _path.join)(dir, 'yarn.lock'); //  解析.npmrc中的内容变成一个对象

var npmRc = (0, _path.join)(process.env.HOME, '.npmrc');
var npmRcBuffer = (0, _fs.readFileSync)(npmRc, 'utf-8');

var npmConfig = _ini["default"].parse(npmRcBuffer); //  拼凑出包名的完整路径


var packageUrl = function packageUrl(pkg) {
  return "".concat(npmConfig.registry || 'https://www.npmjs.com/package/').concat(pkg);
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

var installDep = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(pkg, opt) {
    var yarnExist, npmExist, packageExist, typesPkg, isTypeScript, useYarn, finalCmd, isYarn, typeExist, cmds, _i, _cmds, cmdItem;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return commandExist('yarn');

          case 2:
            yarnExist = _context2.sent;
            _context2.next = 5;
            return commandExist('npm');

          case 5:
            npmExist = _context2.sent;
            _context2.next = 8;
            return searchPackage(pkg);

          case 8:
            packageExist = _context2.sent;
            typesPkg = "@types/".concat(pkg);
            isTypeScript = !opt.js;
            useYarn = (0, _fs.existsSync)(yarnLock);

            if (!packageExist) {
              console.log(_colorconsole["default"].text("".concat(pkg, " \u4E0D\u5B58\u5728,\u8BF7\u5207\u6362\u955C\u50CF\u6E90\u6216\u8005\u68C0\u67E5\u5305\u540D\u662F\u5426\u6B63\u786E\u540E\u91CD\u8BD5"), 'red'));
              process.exit();
            }

            cmds = []; //  指定了npm就用npm安装, 否则优先使用yarn安装

            if (opt.npm) {
              if (npmExist) {
                finalCmd = 'npm';
              } else if (yarnExist) {
                finalCmd = 'yarn';
              } else {
                process.exit();
              }
            } else if (opt.yarn) {
              if (yarnExist) {
                finalCmd = 'yarn';
              } else if (npmExist) {
                finalCmd = 'npm';
              } else {
                process.exit();
              }
            } else {
              if (useYarn) {
                finalCmd = 'yarn';
              } else {
                finalCmd = 'npm';
              }
            }

            isYarn = finalCmd === 'yarn';
            cmds.push({
              cmd: finalCmd,
              pkgName: pkg,
              args: [isYarn ? 'add' : 'install', pkg]
            });

            if (!isTypeScript) {
              _context2.next = 22;
              break;
            }

            _context2.next = 20;
            return searchPackage(typesPkg);

          case 20:
            typeExist = _context2.sent;

            if (typeExist) {
              cmds.push({
                cmd: finalCmd,
                pkgName: typesPkg,
                args: [isYarn ? 'add' : 'install', typesPkg, isYarn ? '--dev' : '--save-dev']
              });
            }

          case 22:
            for (_i = 0, _cmds = cmds; _i < _cmds.length; _i++) {
              cmdItem = _cmds[_i];
              console.log('开始安装: ', _colorconsole["default"].text(cmdItem.pkgName, 'cyan'));
              console.log();

              _crossSpawn["default"].sync(cmdItem.cmd, cmdItem.args, {
                stdio: 'inherit'
              });
            }

            console.log('安装完成');

            if (isTypeScript && !typeExist) {
              console.log();
              console.log(_colorconsole["default"].text("@types/".concat(pkg), 'red'), '未找到, 请自行编写声明文件');
            }

            process.exit();

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function installDep(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = installDep;
exports["default"] = _default;