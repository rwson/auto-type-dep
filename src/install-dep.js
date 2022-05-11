import commander from "commander";
import which from "which";
import spawn from "cross-spawn";
import colorconsole from "@kenworks/colorconsole";
import npa from "npm-package-arg";
import ini from "ini";

import { get } from "https";
import { join } from "path";
import { readFileSync, existsSync } from "fs";

const dir = process.cwd();
const yarnLock = join(dir, "yarn.lock");

const dtsSuffix = /d\.ts$/;

//  解析.npmrc中的内容变成一个对象
const npmRc = join(process.env.USERPROFILE || process.env.HOME, ".npmrc");
const npmRcBuffer = readFileSync(npmRc, "utf-8");
const npmConfig = ini.parse(npmRcBuffer);

const excludeArgs = [
  "add",
  "--js",
  "-js",
  "--npm",
  "-n",
  "--pnpm",
  "-p",
  "--yarn",
  "--y",
];

//  拼凑出包名的完整路径
const packageUrl = (pkg) => {
  let originUrl = npmConfig.registry || "https://www.npmjs.com/package/";

  if (!originUrl.endsWith("/")) {
    originUrl = `${originUrl}/`;
  }

  return `${originUrl}${pkg}`;
};

//  判断是否存在typings
const isExportedTypings = (pkg, version) => {
  return new Promise((resolve) => {
    get(`https://registry.npmmirror.com/${pkg}`, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const { versions = {} } = JSON.parse(data.toString("utf8"));
          const targetVersion = versions[version] || Object.values(versions)[0];

          if (!targetVersion) {
            resolve(false);
          } else {
            resolve(dtsSuffix.test(targetVersion.typings) || dtsSuffix.test(targetVersion.types));
          }
        } catch (e) {
          resolve(false);
        }
      });
    }).on("error", (e) => {
      resolve(false);
    });
  });
};

//  搜索该包是否存在当前镜像
const searchPackage = (pkg) => {
  const url = packageUrl(pkg);
  return new Promise((resolve) => {
    get(url, (res) => {
      if (res.statusCode === 404) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).on("error", (e) => {
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
    console.log(
      colorconsole.text(
        `${pkg} does not exist, please switch the mirror source or check whether the package name is correct and try again`,
        "red"
      )
    );
    process.exit();
  }

  let finalCmd;
  let isYarn;
  let typeExist;
  let exportedDts;

  const cmds = [];

  //  指定了npm就用npm安装, 否则优先使用yarn安装
  if (opt.npm) {
    if (opt.npmExist) {
      finalCmd = "npm";
    } else if (opt.yarnExist) {
      finalCmd = "yarn";
    } else {
      process.exit();
    }
  } else if (opt.yarn) {
    if (opt.yarnExist) {
      finalCmd = "yarn";
    } else if (opt.npmExist) {
      finalCmd = "npm";
    } else {
      process.exit();
    }
  } else {
    if (opt.useYarn) {
      finalCmd = "yarn";
    } else {
      finalCmd = "npm";
    }
  }

  isYarn = finalCmd === "yarn";

  cmds.push({
    cmd: finalCmd,
    pkgName: needVersion ? `${pkg}@${parsed.fetchSpec}` : pkg,
    args: [
      isYarn ? "add" : "install",
      needVersion ? `${pkg}@${parsed.fetchSpec}` : pkg,
    ],
  });

  if (isTypeScript) {
    typeExist = await searchPackage(typesPkg);

    if (typeExist) {
      cmds.push({
        cmd: finalCmd,
        pkgName: typesPkg,
        args: [
          isYarn ? "add" : "install",
          typesPkg,
          isYarn ? "--dev" : "--save-dev",
        ],
      });
    }
  }

  for (const cmdItem of cmds) {
    console.log();
    console.log(
      "start installing package",
      colorconsole.text(cmdItem.pkgName, "cyan")
    );
    console.log();

    spawn.sync(cmdItem.cmd, cmdItem.args, {
      stdio: 'inherit'
    });
  }

  exportedDts = await isExportedTypings(parsed.name, parsed.fetchSpec);

  if (isTypeScript && !typeExist) {
    console.log();

    if (exportedDts) {
      console.log(
        "package",
        colorconsole.text(`${parsed.name}`, "cyan"),
        "already exported d.ts declaration file, skip installing",
        colorconsole.text(`@types/${parsed.name}`, "cyan")
      );
      return;
    }
    console.log(
      colorconsole.text(`@types/${parsed.name}`, "red"),
      "not found, please write your own declaration file"
    );
  }
};

const installDep = async (pkg, opt) => {
  const pkgs = commander.args.filter((arg) => !excludeArgs.includes(arg));

  const yarnExist = await commandExist("yarn");
  const npmExist = await commandExist("npm");
  const useYarn = existsSync(yarnLock);

  for (const pkg of pkgs) {
    await installPkg(pkg, {
      ...opt,
      yarnExist,
      npmExist,
      useYarn,
    });
  }

  console.log();
  console.log("auto-type-dep: all done!");

  process.exit();
};

export default installDep;
