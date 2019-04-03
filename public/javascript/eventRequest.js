$(document).ready(function (){
    getCategories();

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
        var country = $("#eventCountry").val();
        var header = document.getElementById("eventHeader").files[0];

        if (!name || !desc || !startDate || !endDate || !category || !venue || !addr || !header || !country) {
            var alert = $("#alert");
            alert.addClass("d-flex justify-content-center mb-4 alert alert-danger");
            alert.html("Please fill out all required fields!");
            return;
        }

        var formData = new FormData();
        formData.append("file", header);
        formData.append("eventName", name);
        formData.append("description", desc);
        formData.append("venue", venue);
        formData.append("address", addr);
        formData.append("country", country);
        formData.append("category", category);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("isRequest", "1");

        $.ajax({
            url: "/api/events/",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData,
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
                $("#eventCountry").val("");
                $("#eventHeader").val("");
            },
            error: function (res) {
                console.log(res);
            }
        })
    });

    //    get Categories
    function getCategories(){
        $.ajax({
            type: 'GET',
            url: 'api/categories',
            dataType: 'json',
            success: function (res) {
                displayCategories(res);
            }
        })
    }

//    display categories on the page
    function displayCategories(cat) {
        var output="";

        for(var i=0; i<cat.length; i++){
            var category= cat[i].name;
            output+=
                "<option value='"+category+"'>"+category+"</option>";
        }
        $("#eventCategory").html(output);
    }

});