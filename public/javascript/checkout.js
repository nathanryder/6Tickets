$(document).ready(function () {

    $("#checkout-1").click(function (e) {
        e.preventDefault();

        var name = $("#checkoutName").val();
        var addrOne = $("#checkoutAddr1").val();
        var addrTwo = $("#checkoutAddr2").val();
        var city = $("#checkoutCity").val();
        var country = $("#checkoutCountry").val();
        var phone = $("#checkoutPhone").val();
        var deliver = $("input[name=customRadio]:checked").val();

        $.redirect("/checkout-2", {name, addrOne, addrTwo, city, country, phone, deliver});

    });

    $("#checkout-2").click(function (e) {
        e.preventDefault();

        var cardNo = $("#cardNo").val();
        var name = $("#name").val();
        var expiry = $("#expiry").val();
        var cvc = $("#cvc").val();

        if (!cardNo || !name || !expiry || !cvc) {
            var alert = $("#alert");
            alert.addClass("alert alert-danger");
            alert.html("Please make sure all fields are correctly filled in!");
            return;
        }


        $.redirect("/checkout-3", {cardNo, name, expiry, cvc});

    });

    $("#completeOrder").click(function (e) {
        e.preventDefault();

        $.redirect("/checkout-complete", {amount: $(".subtotal").html()})
    });

});

