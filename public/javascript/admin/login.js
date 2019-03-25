$(document).ready(function () {

    $("#login-form").submit(function (event) {
        event.preventDefault();
        var username = event.target.loginUsername.value;
        var password = event.target.loginPassword.value;

        if (!username || !password) {
            $("#login-error").html("Invalid login details!");
            return;
        }

        $.ajax({
            type: "POST",
            url: "api/users/login",
            dataType: "json",
            data: {
                "username": username,
                "password": password,
                "adminPage": 1
            },
            success: function (res) {
                window.location.href = "/admin_index";
            },
            error: function (res) {
                $("#login-error").html("Invalid login details!");
            }
        })
    });

});