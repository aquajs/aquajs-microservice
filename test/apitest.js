var assert = require('assert');
var request = require('request');
var util = require('util');
var async = require('async');
var baseurl = 'http://localhost';
var open = require('open');
var hippie = require('hippie');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/ramp',
  _db;


before(function (done) {
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
      console.error(err);
    } else {
      console.log('connected to mongo');
      _db = db;
      this.timeout(15 * 1000);
      startApp(function (err, server) {
        if (err) return done(err);
        baseurl += ':' + server.address().port;
        done();
      });
    }
  }.bind(this));
});

describe('order tests', function() {

  it ('should request apidocs', function(done) {
    var url = baseurl + '/apidoc';
    request(url);
  });

  it ('should create a new order', function(done) {

    var url = baseurl + '/orders';
    var collection = _db.collection('orders');

    var data = {
      "id": 100,
      "order_name": "bbq",
      "order_contents": "bbq chicken pizza",
      "quantity": 1,
      "order_status": "in progress"
    };

    hippie()
      .json()
      //.post('http://localhost:8090/orders')
      .post(url)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        collection.findOne({_id: data.id.toString()}, function(err, result) {
          if (err) return done(err);
          var body = JSON.parse(res.body);
          assert.equal(body.id, result._id);
          done();
        })
      });
  });

  it ('should get the new order', function(done) {

    var data = {
      "id": 100
    };

    var url = baseurl + '/orders/' + data.id;
    var collection = _db.collection('orders');

    hippie()
      .json()
      //.get('http://localhost:8090/orders/100')
      .get(url)
      .end(function(err, res) {
        if (err) return done(err);
        collection.findOne({_id: data.id.toString()}, function(err, result) {
          if (err) return done(err);
          var body = JSON.parse(res.body);
          assert.equal(body[0].id, result._id);
          done();
        })
      });
  });

  it ('should update the order', function(done) {

    var data = {
      "id": 100,
      "order_name": "pepperoni",
      "order_contents": "pepperoni pizza",
      "quantity": 1,
      "order_status": "in progress"
    };

    var url = baseurl + '/orders/' + data.id;
    var collection = _db.collection('orders');


    hippie()
      .json()
      //.put('http://localhost:8090/orders/100')
      .put(url)
      .send(data)
      .end(function (err, res) {
        if (err) return done(err);
        collection.findOne({_id: data.id.toString()}, function(err, result) {
          if (err) return done(err);
          var body = JSON.parse(res.body);
          assert.equal(body[0].order_name, result.order_name);
          assert.equal(body[0].order_contents, result.order_contents);
          done();
        })
      });
  });

  it ('should get all orders', function(done) {

    var url = baseurl + '/orders';
    var collection = _db.collection('orders');

    hippie()
      .json()
      //.get('http://localhost:8090/orders')
      .get(url)
      .end(function (err, res) {
        if (err) return done(err);
        var orders = JSON.parse(res.body);
        collection.find({}).toArray(function(err, result) {
          if (err) return done(err);
          result.forEach(function(entry) {
            orders.forEach(function(order) {
              assert.equal(order.id, entry._id);
            });
          });
          done();
        })
      });
  });

  it ('should delete the order', function(done) {

    var data = {
      "id": 100
    };

    var url = baseurl + '/orders/' + data.id;
    var collection = _db.collection('orders');

    hippie()
      .json()
      //.del('http://localhost:8090/orders/100')
      .del(url)
      .end(function (err, res) {
        if (err) return done(err);
        collection.findOne({_id: data.id.toString()}, function(err, result) {
          if (err) return done(err);
          assert(result === null);
          done();
        })
      });
  });
});


function startApp(callback) {
  var aquajs = require('aquajs'),
    bootstrap = aquajs.bootstrap,
    config = require('../config/config');


// bootstrap is responsible for setting up the entire environment,
// including several globals ($dirPaths, $config, $logger, and $app)
  var app = bootstrap(config);

  var server = app.listen($config.port, function() {
    $logger.info("[microservice] listing on port:" + server.address().port);
    callback(null, server);
  });
}