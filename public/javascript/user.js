$(document).ready(function() {

    $("#reg-form").submit(function (event) {
        event.preventDefault();
        //check if password the same
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
            success: function(token){},
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    });


});