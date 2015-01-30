var assert = require('assert');
var request = require('request');
var util = require('util');
var async = require('async');
var baseurl = 'http://localhost';
var hippie = require('hippie');


//before(function (done) {
//  this.timeout(15 * 1000);
//  startApp(function(err, server) {
//    if (err) return done(err);
//    baseurl += ':' + server.address().port;
//    done();
//  });
//});

describe('order tests', function() {

  it ('should create a new order', function(done) {

    var url = baseurl + '/orders';

    var data = {
      "id": 100,
      "order_name": "bbq",
      "order_contents": "bbq chicken pizza",
      "quantity": 1,
      "order_status": "in progress"
    };

    hippie()
      .json()
      .post('http://localhost:8090/orders')
      //.post(url)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });

  });

  it ('should get the new order', function(done) {

    var data = {
      "id": 100
    };

    var url = baseurl + '/orders/' + data.id;

    hippie()
      .json()
      .get('http://localhost:8090/orders/100')
      //.get(url)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
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

    hippie()
      .json()
      .put('http://localhost:8090/orders/100')
      //.put(url)
      .send(data)
      .end(function (err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });

  it ('should get all orders', function(done) {

    var url = baseurl + '/orders';

    hippie()
      .json()
      .get('http://localhost:8090/orders')
      //.get(url)
      .end(function (err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });

  it ('should delete the order', function(done) {

    var data = {
      "id": 100
    };

    var url = baseurl + '/orders/' + data.id;

    hippie()
      .json()
      .del('http://localhost:8090/orders/100')
      //.del(url)
      .end(function (err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
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