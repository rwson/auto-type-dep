#!/usr/bin/env node

import commander from 'commander';
import colorconsole from '@kenworks/colorconsole';

import installDep from './install-dep';
import removeDep from './remove-dep';

const pkg = require('../package.json');

const showTip = (cmd) => {
  if (!cmd) {
    if (process.argv.length < 3) {
      console.log();
      console.log('请指定子命令以及包名: ');
      console.log(
        colorconsole.text('auto-type-dep add', 'cyan'),
        colorconsole.text('<pkg>[@version] [options]', 'green')
      );
      console.log();
      console.log(
        colorconsole.text('auto-type-dep remove', 'cyan'),
        colorconsole.text('<pkg>', 'green')
      );
      console.log();
      console.log(
        '通过',
        colorconsole.text('auto-type-dep --help', 'cyan'),
        '查看帮助文档'
      );
      process.exit();
    }
  } else {
  }
};

showTip();

commander.command('help', null, {noHelp: true});
commander.helpInformation = () => {
  console.log(`
  ${colorconsole.text('Commands:', 'yellow')}

  ● ${colorconsole.text('add <pkg>[@version] [option]', 'green')}
    安装指定的依赖以及@types, 通过@x.y.z指定版本
  
    ${colorconsole.text('Option:', 'cyan')}
      ${colorconsole.text('-n, --npm', 'magenta')}    指定用npm来安装依赖
      ${colorconsole.text('-p, --pnpm', 'magenta')}   指定用pnpm来安装依赖
      ${colorconsole.text('-y, --yarn', 'magenta')}   指定用yarn来安装依赖
      ${colorconsole.text('-js, --js', 'magenta')}    指定这是一个js项目, 只安装<pkg>, 不安装@types

  ● ${colorconsole.text('remove <pkg>', 'green')}
    卸载指定的依赖以及@types, 自动从项目下的package.json中查找, 如果存在, 就卸载
  `);
  return '';
};

commander.version(pkg.version);

commander
  .command('add <pkg>')
  .description('安装指定的依赖以及@types')
  .option('-n, --npm', '指定用npm来安装依赖')
  .option('-p, --pnpm', '指定用pnpm来安装依赖')
  .option('-y, --yarn', '指定用yarn来安装依赖')
  .option('-js, --js', '指定这是一个js项目, 只安装<pkg>, 不安装@types')
  .action(installDep);

commander
  .command('remove <pkg>')
  .description('卸载指定的依赖以及@types')
  .action(removeDep);

commander.option('-h, --help', '帮助文档');

try {
  commander.parse(process.argv);
} catch (err) {
  console.log(err);
  console.log(
    '通过',
    colorconsole.text('auto-type-dep --help', 'cyan'),
    '查看帮助文档'
  );
  process.exit();
}
