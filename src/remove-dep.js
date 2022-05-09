import commander from 'commander';
import readPkg from 'read-pkg';
import spawn from 'cross-spawn';
import colorconsole from '@kenworks/colorconsole';

import { existsSync } from 'fs';
import { join } from 'path';

const dir = process.cwd();
const packageJsonPath = join(dir, 'package.json');

const yarnLock = join(dir, 'yarn.lock');

const excludeArgs = [
  'remove',
  '--js',
  '-js',
  '--npm',
  '-n',
  '--yarn',
  '--y'
];

const remove = (pkg, dependencies, devDependencies, useYarn) => {
  const typesPkg = `@types/${pkg}`;
  const cmd = [];

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

const removePkg = async(pkg) => {
  const pkgs = commander.args.filter((arg) => !excludeArgs.includes(arg));

  const { dependencies, devDependencies } = await readPkg(packageJsonPath);
  const typesPkg = `@types/${pkg}`;
  const useYarn = existsSync(yarnLock);

  let cmds = [];

  pkgs.forEach((pkg) => {
    cmds = cmds.concat(remove(pkg, dependencies, devDependencies, useYarn));
  })

  if (cmds.length === 0) {
    console.log(colorconsole.text(pkg, 'red'), '、', colorconsole.text(typesPkg, 'red'), 'does not exist, please check the declaration file for redundant content');
    console.log();
  }

  for (const cmdItem of cmds) {
    console.log('start removing', colorconsole.text(cmdItem.pkgName, 'cyan'));
    console.log();

    spawn.sync(cmdItem.cmd, cmdItem.args, {
      stdio: 'inherit'
    });
  }

  console.log();
  console.log("auto-type-dep: all done!");
};

export default removePkg;
