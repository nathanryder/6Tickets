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
            output+=
                "<div>"+event[i].name+"  "+event[i].startDate+"  "+event[i].venue+"</div>";
            console.log(event[i]);
        }
        $("#searchResults").html(output);
    }

});