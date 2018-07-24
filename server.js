//mongodb://<dbuser>:<dbpassword>@ds147391.mlab.com:47391/tagtestdb

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb://wesborland1234:fakepassword1@ds147391.mlab.com:47391/tagtestdb";
var mongodb = require('mongodb');

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
	console.log(req.body);
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

app.post('/record', function (req, res) {
	console.log(req.body);
	db.collection('records').insert(req.body, function(err, doc){
		res.json(doc);
	});
});