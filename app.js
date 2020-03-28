// Copyright 2016 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START gae_flex_node_static_files]
'use strict';

const express = require('express');
const app = express();
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

var fs = require('fs');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAkGopYf5Rgen_GgBpJ_VwQAzNZ1LRx3sg",
    authDomain: "covid-19-help-desk.firebaseapp.com",
    databaseURL: "https://covid-19-help-desk.firebaseio.com",
    projectId: "covid-19-help-desk",
    storageBucket: "covid-19-help-desk.appspot.com",
    messagingSenderId: "259588761043",
    appId: "1:259588761043:web:b45b72ba9d8707bb6dfb26",
    measurementId: "G-KZ7SN1WW8F"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var path = require('path');

//app.set('view engine', 'pug');
app.use(express.urlencoded());
// Use the built-in express middleware for serving static files from './public'
app.use(express.static('public'));
app.get('/volunteer_login', (req, res) => {

    res.sendFile(path.join(__dirname + '/volunteer_login.html'));
});
app.post('/to_cart', (req, res) => {
    if (req.body.phone != "") {
        // res.sendFile(path.join(__dirname + '/cart.html'));

        fs.readFile(path.join(__dirname + '/shopping_cart.html'), function(err, data) {
            res.write(data);
            res.write("<script>var t=9946784176;</script>");
            return res.end();
        });

    } else {
        res.status(404).send('Unautharised').end();
    }
});
app.post('/pass', (req, res) => {
    if (req.body.from != "") {
        // res.sendFile(path.join(__dirname + '/cart.html'));

        firebase.database().ref(req.body.from + '/det').once('value', function(snapshot) {
            var city = snapshot.child("city").val();
            var dist = snapshot.child("distric").val();
            firebase.database().ref('desk/' + dist + '/' + city).orderByValue().limitToLast(3).once('value', function(snapshot) {
                if (snapshot.exists()) {
                    var newRef;
                    var to = "";
                    snapshot.forEach(function(data) {
                        if (newRef == null) {
                            newRef = firebase.database().ref('order/' + data.key).push();
                            newRef.set(req.body.from + "_pending");
                        } else {
                            firebase.database().ref('order/' + data.key).child(newRef.key).set(req.body.from + "_pending");
                        }
                        to += (to == "" ? "" : "_") + data.key;
                        console.log(req.body.from + "_pending");
                    });
                    firebase.database().ref(req.body.from + '/order/').child(newRef.key).set(to + "_pending");
		firebase.database().ref(req.body.from+ '/cart').once('value', function(snapshot) {
 			snapshot.forEach(function(data) {
				firebase.database().ref('cart/').child(newRef.key).child(data.key).set(data.val());
 			});
		firebase.database().ref('cart/').child(newRef.key).child('from_to_status').set(req.body.from+"_x"+"_pending");
 		firebase.database().ref(req.body.from).child('cart').remove();
		
 		});
                    console.log('We are processing');
                    res.status(200).send('We are processing').end();
                } else {
                    console.log('Area is not serviceable');
                    res.status(404).send('Area is not serviceable').end();
                }


            });
        });

    } else {
        res.status(404).send('Unautharised').end();
    }
});
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname + '/hm.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_node_static_files]
