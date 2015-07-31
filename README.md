# node-bauer-cli
Command-line interface for bauer-crawler.

## Installation

This is a command line tool, therefore it must be installed globally.

`npm install bauer-cli -g`

## Usage

 * `bauer new` - Creates a new bauer script inside an empty directory.
 * `bauer run` - Run the bauer script in the current directory.
 * `bauer add [PLUGIN]` - Adds a plugin to the bauer script in the current directory.
 * `bauer remove [PLUGIN]` - Removes a plugin from the bauer script in the current directory.

## Bauer Script

A bauer script is just a node module that exports a function, which is called having a `Promise` as only argument. The context variable is a `bauer-crawler` instance. The function should return a `Promise` that tells the script to end or repeat when its resolved. It uses `bluebird` promise implementation extended with features from loaded plugins.

```js
module.exports = function(promise) {
  
  return promise.fetch("http://http-bin.org")
    .scrape({
      "a[href]": {
        links: {
          url: "attr:href",
          name: "text"
        }
      }
    })
    .extract("$..url")
    .map(function(url) {
      
      return this.promise()
        .fetch(url)
        .then(function() {
          
        });
    })
    .catch(function(error) {
      console.log('something wrong happened',error);
    });
};
```

The `package.json` file contains list of plugins to load and its configurations, besides common node module stuff.

```js
{
  "name": "bauer-project",
  "plugins": [
    "bauer-crawler-fetch",
    "bauer-crawler-scrape",
    "bauer-crawler-extract"
  ],
  "config": {
    "fetch": {
      "workers": 3
    },
    "scrape": {
      "workers": 2
    },
    "extract": {
      "workers": 1
    }
  },
  "dependencies": {
    "bauer-crawler-fetch": "*",
    "bauer-crawler-scrape": "*",
    "bauer-crawler-extract": "*"
  }
}
```

## Bauer Plugin

A bauer plugin is also a node module that follows a simple pattern. Usually it extends the `Promise` with new methods that request processing from workers and resolves when response comes. That's what a bauer plugin looks like:

```js
module.exports = {
  
  // the name is used by configurations and workers
  name: "doSomething",
  
  // default configurations
  config: {
    workers: 2
  },
  
  // executed when starting main process (usually not necessary)
  master: function() {
    
  },
  
  // executed when starting each worker
  worker: function(worker,config) {
    
    worker.on('request',function(request,response) {
      // do something with the request and ...
      response.sendOk({ output: "yo" });
      // or if something goes wrong ...
      response.sendError(new Error("aw crap"));
    });
    
    // this is necessary to tell master the worker is ready to use
    worker.sendReady();
  },
  
  // extend the bluebird Promise prototype
  promise: {
    
    doSomething: function() {
      return this.then(function(value) {
        return this.requestWorker("doSomething",{
          input: value
        }).get("output");
      })
    }
  }
  
};
```

If the plugin gets bigger then its possible to move each part to a separate file which will only be required by the process where it belongs, making each master/worker process as lean as possible.

```js
module.exports = {
  
  name: "myPlugin",
  
  config: {
    // ...
  },
  
  // worker.js should export a function
  // required by the worker process only
  worker: __dirname + "/worker.js",
  
  // promise.js should export an object with methods to extend Promise prototype
  // required by the master process only
  promise: __dirname + "/promise.js"
  
};
```

# License
[MIT](./LICENSE)
