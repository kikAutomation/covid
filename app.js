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
app.get('/sign_up', (req, res) => {
    res.sendFile(path.join(__dirname + '/sign_up.html'));
});

app.post('/sign_up', (req, res) => {
    var ref, isOfficial;
    if (req.body.role == "Health_Inspector" || req.body.role == "Volunteer") {
        isOfficial = true;
        ref = firebase.database().ref('fx/');

    } else {
        isOfficial = false;
        ref = firebase.database().ref();
    }
    ref.child(req.body.phone_number).once('value', function(snapshot) {
        if (snapshot.val() != null) {

            fs.readFile(path.join(__dirname + '/err.html'), function(err, data) {
                var toPrepand = req.body.phone_number + " Is already exisist.Please enter a new phone no to Sign Up";
                data = data.toString().replace("#skjfjkhfeiylweorfkjjnebhfdfyehfjlkrfhegrfnclkjdvboehfied", toPrepand);
                res.write(data);
                return res.end();
            });
        } else {
            ref.child(req.body.phone_number).set({
                name: req.body.name + "",
                address: req.body.address,
                city: req.body.city,
                role: req.body.role,
                address: req.body.address,
                phone_number: req.body.phone_number,
                pass: req.body.password,
                pin: req.body.po
            });
            if (isOfficial) {
                firebase.database().ref('desk/' + req.body.city).child(req.body.phone_number + "").set(0);

            }
            res.sendFile(path.join(__dirname + '/hm.html'));
        }
    });

});
app.post('/login', (req, res) => {
    console.log('lllllllll' + req.body.from);
    if (req.body.from != "") {
        console.log("fx/" + req.body.from);
        var fx = req.body.from.substring(0, 1);
        firebase.database().ref('keyy_b').child(myTrim(req.headers['user-agent'])).set(req.body.from);
        if (fx.includes("#")) {
            fx = req.body.from.substring(1);
            console.log("fx/" + fx);
            firebase.database().ref("fx/" + fx).once('value', function(snapshot) {
                if (snapshot.child("pass").val() == req.body.pass) {

                    res.status(200).send('ok').end();
                } else {
                    res.status(404).send('Unautharised').end();
                }
            });
        } else {
            firebase.database().ref(req.body.from + '/det').once('value', function(snapshot) {
                if (snapshot.child("pass").val() == req.body.pass) {
                    res.status(200).send('ok').end();
                } else {
                    res.status(404).send('Unautharised').end();
                }
            });
        }
    } else {
        res.status(404).send('Unautharised').end();
    }
});
app.post('/to_cart', (req, res) => {
    if (req.body.from != "") {
        // res.sendFile(path.join(__dirname + '/cart.html'));
        console.log("fx33/" + req.body.from);
        var fx = req.body.from.substring(0, 1);
        if (fx.includes("#")) {
            console.log("fx3t/" + fx);
            fx = req.body.from.substring(1);
            fs.readFile(path.join(__dirname + '/dashV.html'), function(err, data) {
                var toPrepand = "var t=" + fx + ";";
                data = data.toString().replace("//qwertyuhnb238d7hdn938", toPrepand);
                res.write(data);

                return res.end();
            });
        } else {
            fs.readFile(path.join(__dirname + '/shopping_cart.html'), function(err, data) {
                res.write(data);
                res.write("<script>var t=" + req.body.from + ";</script>");
                return res.end();
            });
        }

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
            firebase.database().ref('desk/' + city).orderByValue().limitToLast(3).once('value', function(snapshot) {
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
                    firebase.database().ref(req.body.from + '/cart').once('value', function(snapshot) {
                        snapshot.forEach(function(data) {
                            firebase.database().ref('cart/').child(newRef.key).child(data.key).set(data.val());
                        });
                        firebase.database().ref('cart/').child(newRef.key).child('from_to_status').set(req.body.from + "_x" + "_pending");
                        firebase.database().ref(req.body.from).child('cart').remove();

                    });
                    console.log('We are processing');
                    fs.readFile(path.join(__dirname + '/track.html'), function(err, data) {
                        var toPrepand = "var t=" + req.body.from + ";";
                        data = data.toString().replace("//qwertyuhnb238d7hdn938", toPrepand);
                        res.write(data);

                        return res.end();
                    });
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
app.get('/to_cart', (req, res) => {
    myPath(req, res, 'dashV');
});
app.get('/', (req, res) => {
    myPath(req, res, '/');
});
app.get('/shopping_cart', (req, res) => {
    myPath(req, res, 'shopping_cart');
});
app.get('/request_out', (req, res) => {

    myPath(req, res, 'request_to_out');
});

app.get('/track', (req, res) => {
    myPath(req, res, 'track');
});
app.get('/out', (req, res) => {
    console.log(req.headers['user-agent']);
    firebase.database().ref('keyy_b').child(myTrim(req.headers['user-agent'])).remove();
    res.sendFile(path.join(__dirname + '/hm.html'));
});

function myTrim(x) {
    return x.replace(/ /g, '').replace(/\//g, '').replace(/\./g, '');
}

function myPath(req, res, page) {
    var fx;

    firebase.database().ref('keyy_b').child(myTrim(req.headers['user-agent'])).once("value", function(snapshot) {
        if (snapshot.val() != null) {
            if (snapshot.val().includes('#')) {
                fx = snapshot.val().substring(1);
                if (page == "/") page = 'dashV';
            } else {
                if (page == "/") page = 'shopping_cart';
                fx = snapshot.val();
            }
            fs.readFile(path.join(__dirname + '/' + page + '.html'), function(err, data) {



                var toPrepand = "var t=" + fx + ";";
                data = data.toString().replace("//qwertyuhnb238d7hdn938", toPrepand);
                res.write(data);
                console.log(snapshot.val());
                return res.end();
            });
        } else {
            res.sendFile(path.join(__dirname + '/hm.html'));
        }

    }, function(errorObject) {
        res.sendFile(path.join(__dirname + '/hm.html'));
    });
}
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_node_static_files]
