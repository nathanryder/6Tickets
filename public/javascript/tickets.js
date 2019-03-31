$(document).ready(function() {
    getEvents();

    $("#eventSearchForm").on('keyup', function () {
        getEvents();
    });

    $("#categorySelect").on('change',function () {
        getEvents();
    });

    function getEvents(){
        var eventName = document.getElementById("eventSearchForm").value;
        var category = document.getElementById("categorySelect").value;

        $.ajax({
            type: 'GET',
            url: 'api/events/search?q=' + eventName + '&category=' + category,
            dataType: 'json',
            success: function (res) {
                displayEvents(res);
            }
        })
    }

    function displayEvents(event){
        var output="<div class=\"table-responsive\">\n" +
            "    <table class=\"table table-hover\">\n" +
            "        <thead class=\"thead-light\">\n" +
            "        <tr>\n" +
            "            <th scope=\"col\">Name</th>\n" +
            "            <th scope=\"col\">Address</th>" +
            "            <th scope=\"col\">Venue</th>\n" +
            "            <th scope=\"col\">Start Date</th>\n" +
            "        </tr>\n" +
            "        </thead>\n" +
            "        <tbody>";

        for(var i=0; i<event.length; i++){
            var name=event[i].name;
            var address = event[i].address;
            var venue = event[i].venue;
            var startDate = event[i].startDate.split('T');

            output+=
                "        <tr>\n" +
                "            <th scope=\"row\"><a href=\"\" class=\"text-info\">"+name+"</a></th>\n" +
                "            <td>"+address+"</td>" +
                "            <td>"+venue+"</td>\n" +
                "            <td>"+startDate[0]+"</td>\n" +
                "        </tr>"

        }
        output+=
            "        </tbody>\n" +
            "    </table>"
        $("#searchResults").html(output);
    }

});