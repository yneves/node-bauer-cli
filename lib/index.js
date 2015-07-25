#! /usr/bin/env node
/*!
**  bauer-cli -- Command-line interface for bauer-crawler.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-cli>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var fs = require("fs");
var path = require("path");
var npm = require("npm");

// - -------------------------------------------------------------------- - //

module.exports = {
  
  // bauer add [plugin]
  add: function() {
    var plugin = process.argv[3];
    var cwd = process.cwd();
    var packageFile = path.resolve(cwd,"package.json");
    
    fs.exists(packageFile,function(packageFileExists) {
      if (packageFileExists) {
        
        var packageData = require(packageFile);
        if (!packageData.plugins) {
          packageData.plugins = [];
        }
        if (packageData.plugins.indexOf(plugin) === -1) {
          packageData.plugins.push(plugin);
        }
        if (!packageData.dependencies) {
          packageData.dependencies = {};
        }
        if (!packageData.dependencies[plugin]) {
          packageData.dependencies[plugin] = "*";
        }
        
        packageData = JSON.stringify(packageData,null,2);
        
        fs.writeFile(packageFile,packageData,function(error) {
          if (error) {
            throw error;
          } else {
            
            npm.load(function(error,npm) {
              if (error) {
                throw error;
              } else {
                npm.commands.install([plugin],function(error) {
                  if (error) {
                    throw error;
                  }
                });
              };
            });
          }
        });
        
      } else {
        throw new Error("package.json not found");
      }
    });
  },
  
  // bauer remove [plugin]
  remove: function() {
    var plugin = process.argv[3];
    var cwd = process.cwd();
    var packageFile = path.resolve(cwd,"package.json");
    
    fs.exists(packageFile,function(packageFileExists) {
      if (packageFileExists) {
        
        var packageData = require(packageFile);
        if (packageData.plugins) {
          var indexOf = packageData.plugins.indexOf(plugin);
          if (indexOf > -1) {
            packageData.plugins.splice(indexOf,1);
          }
        }
        
        packageData = JSON.stringify(packageData,null,2);
        
        fs.writeFile(packageFile,packageData,function(error) {
          if (error) {
            throw error;
          } else {
            
            npm.load(function(error,npm) {
              if (error) {
                throw error;
              } else {
                npm.commands.uninstall([plugin],function(error) {
                  if (error) {
                    throw error;
                  }
                });
              };
            });
          }
        });
        
      } else {
        throw new Error("package.json not found");
      }
    });
  },
  
  // bauer new
  new: function() {
    
    var cwd = process.cwd();
    
    fs.readdir(cwd,function(error,files) {
      if (error) {
        throw error;
      } else if (files.length === 0) {
        
        var packageFile = path.resolve(cwd,"package.json");
        var packageData = JSON.stringify({
          name: "bauer-script",
          version: "0.1.0",
          plugins: [],
          config: {},
          dependencies: {
            "bauer-crawler": "*"
          },
          main: "./main.js"
        },null,2);
        
        fs.writeFile(packageFile,packageData,function(error) {
          if (error) {
            throw error;
          } else {
            
            var mainFile = path.resolve(cwd,"main.js");
            var mainData = [
              "module.exports = function(bauer) {",
              "  bauer.exit();",
              "};"
            ].join("\n");
            
            fs.writeFile(mainFile,mainData,function(error) {
              if (error) {
                throw error;
              } else {
                
                npm.load(function(error,npm) {
                  if (error) {
                    throw error;
                  } else {
                    npm.commands.install(["bauer-crawler"],function(error) {
                      if (error) {
                        throw error;
                      }
                    });
                  };
                });
              }
            });
          }
        });
      } else {
        throw new Error("directory is not empty");
      }
    });
  },
  
  // bauer run
  run: function() {
    
    var cwd = process.cwd();
    var packageDir = path.resolve(cwd);
    var packageFile = path.resolve(cwd,"package.json");
    var crawlerDir = path.resolve(packageDir,"node_modules/bauer-crawler");

    fs.exists(packageFile,function(packageFileExists) {
      if (packageFileExists) {
        fs.exists(crawlerDir,function(crawlerDirExists) {
          if (crawlerDirExists) {
            var Crawler = require(crawlerDir);
            var crawler = new Crawler(packageFile);
            crawler.start(packageDir);
          } else {
            throw new Error("bauer-crawler not found");
          }
        });
      } else {
        throw new Error("package.json not found");
      }
    });
  }
  
};

// - -------------------------------------------------------------------- - //
