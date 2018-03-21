angular.module('services')
.service('PouchService', function($q) {

  var database = 'ml100k';
  var remoteDatabase = 'http://localhost:5984/' + database;
  remoteDatabase = 'http://ec2-34-213-181-90.us-west-2.compute.amazonaws.com:5984/' + database;
  remoteDatabase = 'http://172.16.72.52:4984/cmf_data_sync';

  var dbCache = {};

   var getDb = function (type) {
    var db = dbCache[type];
    return db; 
   }

   this.createIndex = function (type, field) {
    var db = getDb(type);
    if (! db) {
      console.error(type + " db is not initialised yet...");
      return;
    }
    return db.createIndex({
      index: {
        fields: [field]
      }
    });
   }

   this.replicate = function (type, db) {
    if (! db) {
      console.error("db is empty");
      return;
    }
    var options = {
      live: true,
      retry: true
    };

    db.replicate.to(remoteDatabase, options);

    var remoteOptions = angular.copy(options);
    // remoteOptions.filter = function (doc) {
    //   return doc.type === type;
    // }
    remoteOptions.filter = 'sync_gateway/bychannel';
    remoteOptions.query_params = {
        "channels": [ type ]
    };
    db.replicate.from(remoteDatabase, remoteOptions)
    .on('change', function (info) {
      console.log('changed docs length: ', info.docs.length);
    }).on('paused', function (err) {
      console.log('paused', err);
    }).on('active', function () {
      console.log('active');
    }).on('denied', function (err) {
      console.log('paused', err);
    }).on('complete', function (info) {
      console.log('complete', info);
    }).on('error', function (err) {
      console.log('error', err);
    });
  }

  this.initialiseDB = function (type) {
    console.debug("call to initialiseDB");
    console.info("initialising db" + database + "::" + type);
    var db = dbCache[type];
    if (! db) {
      db = new PouchDB(database + "::" + type);
      dbCache[type] = db;
      this.replicate(type, db);
    }
   }

   this.find = function (type, selector, sort, limit, skip) {
      var db = getDb(type);
      var queryParams = {
          selector: selector,
          sort: sort
      };
      if (limit > -1) {
          queryParams.limit = limit;
          queryParams.skip = 0;
      }
      if (skip > -1) {
          queryParams.skip = skip;
      }

      return db.find(queryParams);
  };

  this.totalCount = function (type) {
    var db = getDb(type);
    return db.allDocs({
      include_docs: false
    });
  } 

});
