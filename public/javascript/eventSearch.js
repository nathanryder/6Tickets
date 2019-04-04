$(document).ready(function() {
    //on load
    getCategories();
    // getEvents();

// -- TIGGERS --

    $("#eventSearchForm").on('keyup', function () {
        getEvents();
    });

    $("#categorySelect").on('change',function () {
        getEvents();
    });

// -- FUNCTIONS --

    //gets matching events
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
            var id=event[i]._id;
            var name=event[i].name;
            var address = event[i].address;
            var venue = event[i].venue;
            var startDate = event[i].startDate.split('T');

            output+=
                "        <tr id='event-"+id+"'>\n" +
                "            <th scope='row'><a href='' class='text-info'>"+name+"</a></th>" +
                "            <td>"+address+"</td>" +
                "            <td>"+venue+"</td>" +
                "            <td>"+startDate[0]+"</td>" +
                "            <td><a href='/ticket-sell?eventId="+id+"'><i class='fa fa-arrow-right'></i></a>"+
                "        </tr>";
        //    <i class="fa fa-arrow-right"></i>
        //    <button type='button' class='btn btn-outline-dark'>Select</button>

        }
        output+=
            "        </tbody>\n" +
            "    </table>";
        $("#searchResults").html(output);
    }

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
        var output="";//"<option value=''>-------</option>";

        for(var i=0; i<cat.length; i++){
            var category= cat[i].name;
            output+=
                "<option value='"+category+"'>"+category+"</option>";
        }
        $("#categorySelect").html(output);
        getEvents();
    }

});