$(document).ready(function () {

    $(".wishlist").click(function () {
        var ticketID = $(this).attr("tid");
        var username = $("#username").attr("username");

        $.ajax({
            url: "/api/users/" + username + "/wishlist",
            type: "POST",
            data: {
                "ticketID": ticketID
            }
        });

    });

});