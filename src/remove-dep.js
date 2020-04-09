import readPkg from 'read-pkg';
import spawn from 'cross-spawn';
import colorconsole from '@kenworks/colorconsole';

import { existsSync } from 'fs';
import { join } from 'path';

const dir = process.cwd();
const packageJsonPath = join(dir, 'package.json');

const yarnLock = join(dir, 'yarn.lock');

const removePkg = async(pkg) => {
  const { dependencies, devDependencies } = await readPkg(packageJsonPath);
  const typesPkg = `@types/${pkg}`;
  const useYarn = existsSync(yarnLock);

  const cmds = [];

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
    console.log('卸载失败: ', colorconsole.text(pkg, 'red'), '、', colorconsole.text(typesPkg, 'red'), '都不存在, 请检查声明文件是否有冗余内容');
    console.log();

    process.exit();
  }

  for (const cmdItem of cmds) {
    console.log('开始卸载: ', colorconsole.text(cmdItem.pkgName, 'cyan'));
    console.log();

    spawn.sync(cmdItem.cmd, cmdItem.args, {
      stdio: 'inherit'
    });
  }

  console.log('卸载完成');
  process.exit();
};

export default removePkg;
