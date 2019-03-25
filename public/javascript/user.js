$(document).ready(function() {

    //check passwords
    $("#registerPassword, #registerConfirmPassword").on('keyup', function(){
        var password = document.getElementById("registerPassword").value;
        var passwordConfirm = document.getElementById("registerConfirmPassword").value;
        var errorMsg = "";

        if (password !== passwordConfirm) {
            errorMsg += "<span>Passwords are different!</span><br>";
        }
        if(password.length<=10){
            errorMsg += "<span>Your password must be at least 10 characters long!</span><br>";
        }
        if(password.match(/[^A-Za-z0-9]/) === null) {
            errorMsg += "<span>Your password need to contain at least one special character!</span><br>"
        }
        if(password.match(/[0-9]/) === null) {
            errorMsg += "<span>Your password needs to contain at least one number!</span><br>"
        }
        if(password.match(/[A-Z]/) === null) {
            errorMsg += "<span>Your password needs to contain at least one upper case letter!</span><br>"
        }

        if(errorMsg===""){
            $("#error").html("");
            $("#registerBtn").prop("disabled",false);
        }
        else {
            $("#error").html(errorMsg);
            $("#registerBtn").prop("disabled",true);
        }
    });


    $("#reg-form").submit(function (event) {
        event.preventDefault();
        var username = event.target.registerUsername.value;

        $.ajax({
            type: 'POST',
            url: 'api/users/'+username,
            dataType: 'json',
            data: {
                'password': event.target.registerPassword.value,
                'firstname': event.target.registerFirstName.value,
                'lastname': event.target.registerLastName.value,
                'emailAddress': event.target.registerEmail.value,
                'phoneNo': event.target.registerPhone.value,
                'addressOne': event.target.registerAddressOne.value,
                'addressTwo': event.target.registerAddressTwo.value,
                'city': event.target.registerCity.value,
                'country': event.target.registerCountry.value
            },
            success: function(token){
                window.location.href = "/login";
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    });

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
                "adminPage": 0,
                "username": username,
                "password": password
            },
            success: function (res) {
                window.location.href = "/";
            },
            error: function (res) {
                $("#login-error").html("Invalid login details!");
            }
        })
    });
});