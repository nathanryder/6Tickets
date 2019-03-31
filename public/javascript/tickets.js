$(document).ready(function() {
    var events=null;
    getEvents();

    $("#eventSearchForm").on('keyup', function () {
        getEvents();
    });

    $("#categorySelect").on('change',function () {
        getEvents();
    });

    //gets matching events
    function getEvents(){
        var eventName = document.getElementById("eventSearchForm").value;
        var category = document.getElementById("categorySelect").value;

        $.ajax({
            type: 'GET',
            url: 'api/events/search?q=' + eventName + '&category=' + category,
            dataType: 'json',
            success: function (res) {
                events=res;
                displayEvents(res);
            }
        })
    }

    //actually displayes events
    function displayEvents(event){
        var output="<div class=\"table-responsive\">\n" +
            "    <table class=\"table table-hover\">\n" +
            "        <thead class=\"thead-light\">\n" +
            "        <tr>\n" +
            "            <th scope=\"col\">Name</th>\n" +
            "            <th scope=\"col\">Address</th>" +
            "            <th scope=\"col\">Venue</th>\n" +
            "            <th scope=\"col\">Start Date</th>\n" +
            "            <th scope=\"col\"></th>\n" +
            "        </tr>\n" +
            "        </thead>\n" +
            "        <tbody id=\"searchResultsTable\">";

        for(var i=0; i<event.length; i++){
            var id=event[i].id;
            var name=event[i].name;
            var address = event[i].address;
            var venue = event[i].venue;
            var startDate = event[i].startDate.split('T');

            output+=
                "        <tr id=\"event-"+i+"\">\n" +
                "            <th scope=\"row\"><a href=\"\" class=\"text-info\">"+name+"</a></th>\n" +
                "            <td>"+address+"</td>" +
                "            <td>"+venue+"</td>\n" +
                "            <td>"+startDate[0]+"</td>\n" +
                "            <td><a href=''><i class=\"fa fa-arrow-right\"></i></a>"+
                "        </tr>"
        //    <i class="fa fa-arrow-right"></i>
        //    <button type='button' class='btn btn-outline-dark'>Select</button>

        }
        output+=
            "        </tbody>\n" +
            "    </table>"
        $("#searchResults").html(output);
    }

});