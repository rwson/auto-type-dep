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
      console.log('Please specify subcommand and package name');
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
    Install the specified dependencies and @types, specify the version via @x.y.z
  
    ${colorconsole.text('Option:', 'cyan')}
      ${colorconsole.text('-n, --npm', 'magenta')}    Specify install dependencies via npm
      ${colorconsole.text('-y, --yarn', 'magenta')}   Specify install dependencies via yarn
      ${colorconsole.text('-js, --js', 'magenta')}    Specify that this is a js project, only install <pkg>, not install @types

  ● ${colorconsole.text('remove <pkg>', 'green')}
    Uninstall the specified dependencies and @types, automatically find them from the package.json under the project, and uninstall if they exist
  `);
  return '';
};

commander.version(pkg.version);

commander
  .command('add <pkg>')
  .description('Install the specified dependencies and@types')
  .option('-n, --npm', 'Specify install dependencies via npm')
  .option('-y, --yarn', 'Specify install dependencies via yarn')
  .option('-js, --js', 'Specify that this is a js project, only install <pkg>, not install @types')
  .action(installDep);

commander
  .command('remove <pkg>')
  .description('Uninstall the specified dependencies and @types')
  .action(removeDep);

commander.option('-h, --help', 'Docs');

try {
  commander.parse(process.argv);
} catch (err) {
  console.log(err);
  console.log(
    'View Docs via',
    colorconsole.text('auto-type-dep --help', 'cyan'),
  );
  process.exit();
}
