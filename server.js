//mongodb://<dbuser>:<dbpassword>@ds147391.mlab.com:47391/tagtestdb

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb://wesborland1234:fakepassword1@ds147391.mlab.com:47391/tagtestdb";
var mongodb = require('mongodb');
var path = require('path');
var bcrypt = require('bcryptjs');

var protectedRoute = '/tDn9K0druxmCsHUQG3lBULthwHVDzB2SSahM7e';

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

//Connect to Mongo
var db;
MongoClient.connect(MongoUrl, (err, client) => {
    if (err) return console.log(err)
    db = client.db('tagtestdb') // whatever your database name is
    app.listen(process.env.PORT || 3000, function(){
        console.log("Application is listening on port 3000, or whatever.");
    });
});

app.post('/applicant', function (req, res) {
	//console.log(req.body);
	db.collection('applicants').insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

app.put('/applicant/:id', function (req, res) {
  var id = req.params.id;
  db.collection('applicants').updateOne({_id: new mongodb.ObjectID(id)},
    {$set: {
        elapsedTime: req.body.elapsedTime,
        accuracy: req.body.accuracy}}, 
	function (err, doc) {
      res.json(doc);
    }
  );
});

app.put('/applicantqc/:id', function (req, res) {
  var id = req.params.id;
  db.collection('applicants').updateOne({_id: new mongodb.ObjectID(id)},
    {$set: {
        qcTime: req.body.qcTime,
        qcAccuracy: req.body.qcAccuracy}}, 
	function (err, doc) {
      res.json(doc);
    }
  );
});

app.get('/applicant', function(req, res) {
	db.collection('applicants').find().toArray(function(err, results){
		res.json(results);
	});
});

app.post('/record', function (req, res) {
	//console.log(req.body);
	db.collection('records').insert(req.body, function(err, doc){
		res.json(doc);
	});
});

app.get('/admin', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.get('/record/:id', function (req, res) {
	var queryUserId = req.params.id;
	db.collection('records').find({userId: queryUserId}).toArray(function(err, results){
		res.json(results);
	});
});

app.post('/register', function (req, res) {
  db.collection('admins', function (err, adminsCollection) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash){
        var newAdmin = {
          username: req.body.username,
          password: hash
        };
        adminsCollection.insert(newAdmin, function (err, doc){
          res.json(doc);
        });
      });
    });
  });
});

app.get(protectedRoute, function(req, res) {
  res.sendFile(path.join(__dirname + '/public/applicants.html'));
});

app.post('/login', function (req, res) {
  console.log("in signin function backend");
  db.collection('admins', function(err, adminsCollection) {
    adminsCollection.findOne({username: req.body.username}, function(err, admin){
      console.log(admin);
      bcrypt.compare(req.body.password, admin.password, function(error, result) {
        console.log(result);
        if (result) {
          console.log("in correct if");
          console.log(protectedRoute);
          res.json({err: 0, redirectUrl: protectedRoute});
          //res.sendFile(path.join(__dirname + '/public/applicants.html'));
        } else {
          res.sendStatus(401);
        }
      });
    });
  });
  //After verified user:
});