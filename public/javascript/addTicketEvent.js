$(document).ready(function (){

    var link = window.location.href.split("?");
    if (link.length > 1) {
        var linkArgs = link[1].split("&");
        var args = [];

        for (var i = 0; i < linkArgs.length; i++) {
            args.push(linkArgs[i]);
        }

        if (args.includes("event")) {
            $("#ticket-tab").removeClass("active");
            $("#ticket").removeClass("active show");
            $("#event-tab").addClass("active");
            $("#event").addClass("active show");
        }
    }

    //Event request form
    $("#event-form").submit(function (e) {
        e.preventDefault();

        var name = $("#eventName").val();
        var desc = $("#eventDesc").val();
        var startDate = $("#eventStartDate").val();
        var endDate = $("#eventEndDate").val();
        var category = $("#eventCat").val();
        var venue = $("#eventVenue").val();
        var addr = $("#eventAddress").val();
        var header = $("#eventHeader").val();
        var logo = $("#eventLogo").val();

        if (!name || !desc || !startDate || !endDate || !category || !venue || !addr) {
            var alert = $("#alert");
            alert.addClass("d-flex justify-content-center mb-4 alert alert-danger");
            alert.html("Please fill out all required fields!");
            return;
        }

        $.ajax({
            url: "/api/events/",
            type: "POST",
            dataType: "json",
            data: {
                "eventName": name,
                "description": desc,
                "venue": venue,
                "address": addr,
                "category": category,
                "startDate": startDate,
                "endDate": endDate,
                "logo": "logoPath",
                "header": "headerPath",
                "request": 1
            },
            success: function (res) {
                var alert = $("#alert");
                alert.addClass("d-flex justify-content-center mb-4 alert alert-success");
                alert.html("Thank you for submitting a request for a new event<br>" +
                    "We will review your request and get back to you as soon as possible!");

                $("#eventName").val("");
                $("#eventDesc").val("");
                $("#eventStartDate").val("");
                $("#eventEndDate").val("");
                $("#eventCat").val("");
                $("#eventVenue").val("");
                $("#eventAddress").val("");
                $("#eventHeader").val("");
                $("#eventLogo").val("");
            },
            error: function (res) {
                console.log(res);
            }
        })
    });

});