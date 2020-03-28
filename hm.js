

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
}

function toggleCard(cardElementName) {
    var volunteerLoginCard = document.getElementById("Volunteer_Login_Card");
    var trackRequestCard = document.getElementById("Track_Order_Card");
    var medrepLoginCard = document.getElementById("Medicalrep_Login_Card");

    switch (cardElementName) {
        case "Volunteer_Login_Card":
            trackRequestCard.style.display = "none";
            medrepLoginCard.style.display = "none";
            volunteerLoginCard.style.display = "block";
            break;
        case "Track_Order_Card":
            volunteerLoginCard.style.display = "none";
            medrepLoginCard.style.display = "none";
            trackRequestCard.style.display = "block";
            break;
        case "Medicalrep_Login_Card":
            trackRequestCard.style.display = "none";
            volunteerLoginCard.style.display = "none";
            medrepLoginCard.style.display = "block";
            break;
    }
}



$(document).ready(function () {
    $("#post").click(function () {
        document.getElementById("loading_ripple").style.visibility = "visible"
        $("#home").fadeOut(1000);
    });
    $("#track").click(function () {
        document.getElementById("loading_ripple").style.visibility = "visible"
        $("#home").fadeOut(1000);
    });
    $("#login").click(function () {
        document.getElementById("loading_ripple").style.visibility = "visible"
        $("#home").fadeOut(1000);
    });
});
