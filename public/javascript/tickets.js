$(document).ready(function() {

    $("#eventSearchForm").on('keyup', function () {
        var eventName = document.getElementById("eventSearchForm").value;
        var category = document.getElementById("categorySelect").value;
        // if(eventName===""){return}

        $.ajax({
            type: 'GET',
            url: 'api/events/search?q=' + eventName + '&category=' + category,
            dataType: 'json',
            success: function (res) {
                displayEvents(res);
            }
        })
    });

    function displayEvents(event){
        var output="";
        for(var i=0; i<event.length; i++){
            var name=event[i].name;
            var startDate = event[i].startDate;
            var venue = event[i].venue;

            output+=
                "<div>"+name+"  "+startDate+"  "+venue+"</div>";
        }
        $("#searchResults").html(output);
    }

});