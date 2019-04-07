$(document).ready(function() {
    // -- VARIABLES --
    var username = $("#username").attr("username");
    console.log(username)
    var eventID = document.getElementById("data-row-1").getAttribute("data-eventId");
    var startDate = document.getElementById("data-row-1").getAttribute("data-startDate").split("-");
    var endDate= document.getElementById("data-row-1").getAttribute("data-endDate").split("-");
    var cartItemsId=[];

    // -- TRIGGERS --
    displayDates();
    getTickets();

    // -- FUNCTIONS --

    function getCart(tickets){
        $.ajax({
            type: "GET",
            url: "api/users/"+username+"/cart",
            success: function (res) {
                assignCart(res);
                displayTickets(tickets);
            }
        });
    }

    function assignCart(cartItems){
        for(var i=0; i<cartItems.length; i++){
            cartItemsId[i]=cartItems[i].ticketID;
        }
    }

    function getTickets() {
        $.ajax({
            type: "GET",
            url: "api/tickets/search?e="+eventID,
            success: function (res) {
                getCart(res);
            }
        });
    }

    function displayTickets(tickets) {
        var output="";
        for(var i=0; i<tickets.length; i++){
            var inCart=false;
            var ticketID = tickets[i]._id;
            var seller = tickets[i].seller;
            var price = tickets[i].price;
            var seatNo = "Unknown";
            if(tickets[i].seatNo) {
                seatNo = tickets[i].seatNo;
            }
            var description = tickets[i].info;

            for(var z=0; z<cartItemsId.length; z++){
                if(ticketID===cartItemsId[z]){
                    inCart=true;
                    break;
                }
            }

            if(!inCart){
                output+=
                    "<tr id='ticket-"+ticketID+"'>" +
                    "    <th scope='row'>"+seller+"</th>" +
                    "    <td>€"+price+"</td>" +
                    "    <td>"+seatNo+"</td>" +
                    "    <td>"+description+"</td>" +
                    "    <td class='text-center'><button type='button' class='btn btn-success brd-rad-6' id='btn-"+ticketID+"' onclick='addToCart()'>Add to cart</button></td>" +
                    "</tr>";
            }
        }
        $("#tickets-table").html(output);

    }

    function displayDates() {
        startDate= startDate[2]+"-"+startDate[1]+"-"+startDate[0];
        endDate= endDate[2]+"-"+endDate[1]+"-"+endDate[0];

        var outputStart= "Start date: <i>"+startDate+"</i>";
        var outputEnd= "End date: <i>"+endDate+"</i>";

        $("#startDate").html(outputStart);
        $("#endDate").html(outputEnd);
    }

});

// -- FUNCTION CALLED IN HTML --

function addToCart() {
    var ticketID = event.target.id;
    ticketID=ticketID.split("-")[1];

    // var username = $("#username").attr("username");

    $.ajax({
        type: "POST",
        url: "api/users/"+username+"/cart",
        data:{
            "ticketID": ticketID,
            "quantity": 1
        },
        success: function (res) {
            Swal.fire({
                title: 'Successfully added to your cart',
                confirmButtonText: 'Ok'
            });
        }
    })
    $("#ticket-"+ticketID).slideUp();
}