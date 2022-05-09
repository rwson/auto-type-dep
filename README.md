### auto-type-dep

在平时用`TypeScript`开发项目时，如果我们安装一个包的同时没有把改包对应的`@types`装上的话，在导入的时候编辑器会发出警告，如果用`npm`或者`yarn`同时安装的话，又会安装在`dependencies`下面，逼死强迫症的节奏啊，所以就有了`auto-type-dep`，一键安装某个包和它的`@types`，分别安装在`dependencies`和`devDependencies`下面，使用起来也非常简单。

`auto-type-dep`会自动从全局的`.npmrc`中读取配置的镜像, 默认使用淘宝`npm`源来安装依赖。

#### usage

- `[sudo] npm install auto-type-dep -g`把`auto-type-dep`安装成全局模块

- `auto-type-dep add <pkg1>[@version] <pkg2>[@version] <pkg3>[@version] [option]` 安装(多个)npm包

  安装相应的模块以及`@types`，如果在没有指定`-n`的情况下，判断项目中有没有`yarn.lock`文件，如果存在，就使用`yarn`安装，否则使用`npm`安装
  @x.y.z可以指定具体版本号, 否则默认安装最新版本

  | 参数       | 简写 | 作用                                       |
  | -------- | ----- |  ---------------------------------------- |
  | `--npm`  | `-n`  |  指定用`npm`进行安装                             |
  | `--yarn` | `-y`  |  指定用`yarn`进行安装                            |
  | `--js`   | `-js` | 指定当前项目是一个`javascript`项目，不需要安装对应的`@types` |

- `auto-type-dep remove <pkg1> <pkg2> <pkg3>` 卸载(多个)npm包

  卸载相应的模块以及`@types`，首先会判断项目中有没有`yarn.lock`文件，如果存在，就使用  `yarn`卸载，否则使用`npm`卸载

