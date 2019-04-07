

$(document).ready(function () {

    $(".wishlist").click(function () {
        var ticketID = $(this).attr("");
        requestify.post("http://" + req.get("host") + "/api/users/history")
            .send({
                "ticketID": ticketID
            })
            .then(function (resp) {

            });
    });

});