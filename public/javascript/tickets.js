$(document).ready(function() {
    $("#eventSearchForm").on('keyup', function(){
        var eventName=document.getElementById("eventSearchForm").value;
        $.ajax({
            type:'GET'
            url:'api/events/search'
            dataType: 'json',
            data: {
                'query'=eventName,
                'category'=

            }
        })
    }

}