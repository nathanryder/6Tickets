var formCount=1;
$(document).ready(function() {

    // -- TRIGERS --

    $("#addAnother").on("click", function () {
        if(formCount>=10){
            Swal.fire({
                title: 'You can only sell 10 types of tickets a time!',
                confirmButtonText: 'OK',
            })
            return;
        }
        addForm();
    });

    $("#event-form").on("submit", function (e) {
        e.preventDefault();
        var error=false;
        var eventID= document.getElementById("data-row-1").getAttribute("data-_id");
        var sellerUsername= document.getElementById("data-row-1").getAttribute("data-username");

        for(var i=1; i<=formCount; i++){
            var type = document.getElementById("type-"+i).value;
            var ifSeats = document.getElementById("ifSeats-"+i).value;

            var numberOfTickets = document.getElementById("number-"+i).value;
            numberOfTickets = parseInt(numberOfTickets);

            var price = document.getElementById("price-"+i).value;
            var description = document.getElementById("description-"+i).value
            var seats;

            if(ifSeats==="yes" && $("#seatsSpecify-"+i).prop('checked')) {
                seats = document.getElementById("seats-" + i).value;
                seats = seats.replace(/\s+/g, '');
                seats = seats.split(",");


                if (seats.length !== numberOfTickets) {
                    alert("The number of tickets does not match the number of seats!");
                    error = true;
                }

                if (seats.length === 0) {
                    alert("Seats cannot be empty!");
                    error = true;
                }
            }

            if(numberOfTickets<=0 || numberOfTickets===""){
                alert("Number of tickets cannot be zero/empty!");
                error=true;
            }

            if(price===""){
                alert("Price cannot be empty!");
                error=true;
            }

            if(error!==true){
                for(var z=0 ; z<numberOfTickets; z++){
                    var formData = new FormData();
                    formData.append("sellerUsername", sellerUsername);
                    formData.append("eventID", eventID);
                    formData.append("deliveryMethod", type);
                    formData.append("price", price);
                    if($("#seatsSpecify-"+i).prop('checked')){
                        formData.append("seatNo", seats[z]);
                    }
                    if(description!==""){
                        formData.append("info", description);
                    }

                    $.ajax({
                        type: "POST",
                        url: "api/tickets",
                        processData: false,
                        contentType: false,
                        data: formData,
                        success: function (res) {
                        }
                    })
                }
                successAlert("Successfully sold!");
                $("#tickets-"+i).slideUp(800, function () {
                   $(this).remove();
                });
            }
            else{
                alertPush(i);
            }
        }2
    });

    // -- FUNCTIONS --
    var alertOutput="";
    function alert(text) {
        if(alertOutput===""){
            alertOutput=text;
            return;
        }
        alertOutput+="<br>" + text;
    }

    function alertPush(no) {
        if(alertOutput===""){
            return;
        }

        var alert = $("#alert-"+no);
        if($("#alert-"+no).hasClass("alert")){
            alert.html(alertOutput);
            alertOutput="";
            return;
        }
        alert.addClass("mb-4 alert alert-danger");
        alert.html(alertOutput);
        alertOutput="";
    }

    function successAlert(text) {
        var alert = $("#ticketsSell");
        var output=
            "<div class=' col-sm-12 justify-content-center text-center mb-4 alert alert-success'>"+text+"</div>";
        alert.prepend(output);
    }

    function addForm() {
        formCount++;
        var output=
            "<div class='form-row' id='tickets-"+formCount+"'>" +
            "    <hr class='mb-3 hr-' width='100%'>" +
            "" +
            "    <div class='col-sm-12 d-flex justify-content-center text-center' id='success-"+formCount+"'>" +
            "    </div>" +
            "" +
            "    <div class='col-sm-12 d-flex justify-content-center text-center' id='alert-"+formCount+"'>" +
            "    </div>" +
            "" +
            "    <div class='form-group col-sm-12'>" +
            "        <label for='type-"+formCount+"'>*Ticket type</label>" +
            "        <select class='form-control col-sm-5' id='type-"+formCount+"'>" +
            "            <option value='0'>Digital</option>" +
            "            <option value='1'>Physical</option>" +
            "            <option value='2'>Both</option>" +
            "        </select>" +
            "    </div>" +
            "" +
            "    <div class='form-group col-sm-6'>" +
            "        <label for='ifSeats-"+formCount+"'>*Assigned seats</label>" +
            "        <select class='form-control' id='ifSeats-"+formCount+"' onchange='ifSeats()'>" +
            "            <option value='no'>No - seats assigned on first come first served basis</option>" +
            "            <option value='yes'>Yes - seat no. on the ticket</option>" +
            "        </select>" +
            "    </div>" +
            "" +
            "    <div class='form-group col-sm-6'>" +
            "        <div style='margin-left: 5px; margin-top: 8%;'>" +
            "            <label class='text-very-muted' for='seatsSpecify-"+formCount+"' id='seatsSpecifyLabel-"+formCount+"' disabled='disabled'>Specify seats</label>" +
            "            <input type='checkbox' value='true' id='seatsSpecify-"+formCount+"' onchange='specifySeats()' disabled>" +
            "        </div>" +
            "    </div>" +
            "" +
            "    <div id='seatsInput-"+formCount+"'>" +
            "    </div>"+
            "" +
            "    <div class='form-group col-sm-6'>" +
            "        <label for='number-"+formCount+"'>*Number of tickets</label>" +
            "        <input type='number' class='form-control' id='number-"+formCount+"' min='1'>" +
            "    </div>" +
            "" +
            "    <div class='form-group col-sm-6'>" +
            "        <label for='price-"+formCount+"'>*Price</label>" +
            "        <input type='number' class='form-control' id='price-"+formCount+"' min='0'>" +
            "    </div>" +
            "" +
            "" +
            "    <div class='form-group col-sm-12'>" +
            "        <label for='description-"+formCount+"'>Ticket description - optional</label>" +
            "        <textarea class='form-control' id='description-"+formCount+"' rows='4' maxlength='600'></textarea>" +
            "    </div>" +
            "</div>";

        $("#ticketsSell").append(output);
    };


});

// Functions called in HTML
function ifSeats() {
    var id = event.target.id;
    var num = id.split('-')[1];

    if(document.getElementById(id).value==="yes"){
        $("#seatsSpecify-"+num).prop("disabled",false);
        $("#seatsSpecifyLabel-"+num).removeClass("text-very-muted");

    }
    else {
        $("#seatsSpecify-" +num).prop("disabled",true);
        $("#seatsSpecify-" +num).prop('checked', false);
        $("#seatsSpecifyLabel-" +num).addClass("text-very-muted");

        specifySeats();
    }
}


function specifySeats() {
    var id = event.target.id;
    var num = id.split('-')[1];

    if ($("#"+id).prop('checked')){
        output =
            "<label for='seats-'"+formCount+">*Seat numbers</label>" +
            "<input type='text' class='form-control' id='seats-"+formCount+"' placeholder='E.g. A23, B75, H92, AA-321'>";

        $("#seatsInput-" + num).addClass("col-sm-12 mb-3");
        $("#seatsInput-" + num).append(output);
    }
    else {
        output="";
        $("#seatsInput-" + num).html(output);
        $("#seatsInput-" + num).removeClass("col-sm-12 mb-3");
    }

}