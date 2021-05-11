import commander from 'commander';
import which from 'which';
import spawn from 'cross-spawn';
import colorconsole from '@kenworks/colorconsole';
import npa from 'npm-package-arg';
import ini from 'ini';

import { get } from 'https';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

const dir = process.cwd();
const yarnLock = join(dir, 'yarn.lock');

//  解析.npmrc中的内容变成一个对象
const npmRc = join(process.env.USERPROFILE || process.env.HOME, '.npmrc');
const npmRcBuffer = readFileSync(npmRc, 'utf-8');
const npmConfig = ini.parse(npmRcBuffer);

const excludeArgs = [
  'add',
  '--js',
  '-js',
  '--npm',
  '-n',
  '--pnpm',
  '-p',
  '--yarn',
  '--y'
];

//  拼凑出包名的完整路径
const packageUrl = (pkg) => {
  let originUrl = npmConfig.registry || 'https://www.npmjs.com/package/';

  if (!originUrl.endsWith('/')) {
    originUrl = `${originUrl}/`;
  }

  return `${originUrl}${pkg}`;
};

//  搜索该包是否存在当前镜像
const searchPackage = (pkg) => {
  const url = packageUrl(pkg);
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode === 404) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).on('error', (e) => {
      resolve(false);
    });
  });
};

const commandExist = async (cmd) => {
  try {
    await which(cmd);
    return true;
  } catch (e) {
    return false;
  }
};


const installPkg = async (pkg, opt) => {
  const parsed = npa(pkg);
  const packageExist = await searchPackage(parsed.name);
  const typesPkg = `@types/${parsed.name}`;
  const isTypeScript = !opt.js;
  const needVersion = parsed.rawSpec === parsed.fetchSpec;

  pkg = parsed.name;

  if (!packageExist) {
    console.log(colorconsole.text(`${pkg} 不存在,请切换镜像源或者检查包名是否正确后重试`, 'red'));
    process.exit();
  }

  let finalCmd;
  let isYarn;
  let typeExist;

  const cmds = [];

  //  指定了npm就用npm安装, 否则优先使用yarn安装
  if (opt.npm) {
    if (opt.npmExist) {
      finalCmd = 'npm';
    } else if(opt.yarnExist) {
      finalCmd = 'yarn';
    } else {
      process.exit();
    }
  } else if (opt.yarn) {
    if (opt.yarnExist) {
      finalCmd = 'yarn';
    } else if(opt.npmExist) {
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
    pkgName: needVersion ? `${pkg}@${parsed.fetchSpec}` : pkg,
    args: [isYarn ? 'add' : 'install', needVersion ? `${pkg}@${parsed.fetchSpec}` : pkg]
  });

  if (isTypeScript) {
    typeExist = await searchPackage(typesPkg);
    
    if (typeExist) {
      cmds.push({
        cmd: finalCmd,
        pkgName: typesPkg,
        args: [isYarn ? 'add' : 'install', typesPkg, isYarn ? '--dev' : '--save-dev']
      });
    }
  }

  for (const cmdItem of cmds) {
    console.log();
    console.log('开始安装: ', colorconsole.text(cmdItem.pkgName, 'cyan'));
    console.log();

    spawn.sync(cmdItem.cmd, cmdItem.args, {
      stdio: 'inherit'
    });
  }

  if (isTypeScript && !typeExist) {
    console.log();
    console.log(colorconsole.text(`@types/${pkg}`, 'red'), '未找到, 请自行编写声明文件');
  }
};

const installDep = async (pkg, opt) => {

  const pkgs = commander.args.filter((arg) => !excludeArgs.includes(arg));

  const yarnExist = await commandExist('yarn');
  const npmExist = await commandExist('npm');
  const useYarn = existsSync(yarnLock);

  for (const pkg of pkgs) {
    await installPkg(pkg, {
      ...opt,
      yarnExist,
      npmExist,
      useYarn
    });
  }

  console.log();
  console.log('安装完成');

  process.exit();
};

export default installDep;