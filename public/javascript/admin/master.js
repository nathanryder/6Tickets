$(document).ready(function () {

   var alert = $("#alert");
   var alertData = Cookies.get("alert");
   if (alertData) {
       var alertType = alertData.split(":")[0];
       var alertText = alertData.split(":")[1];

       alert.addClass("alert alert-" + alertType);
       alert.html(alertText);

       Cookies.remove("alert");
   }

});