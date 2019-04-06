$(document).ready(function() {
    var formCount=1;
    var forms="";


    // -- TRIGERS --

    $("#addAnother").on("click", function () {
        addForm();
    })

    // -- FUNCTIONS --

    function addForm() {
        formCount++;
        var output=
            "<div class=\"form-row\">" +
            "    <hr class='mb-3 hr-' width='100%'>" +
            "    <div class='form-group col-sm-12'>" +
            "        <label for='ticketType'>*Ticket type</label>" +
            "        <select class='form-control col-sm-5' id='ticketType'>" +
            "            <option value='0'>Digital</option>" +
            "            <option value='1'>Physical</option>" +
            "            <option value='2'>Both</option>" +
            "        </select>" +
            "    </div>" +
            "" +
            "    <div class='form-group col-sm-6'>" +
            "        <label for='ticketType'>*Assigned seats</label>" +
            "        <select class='form-control' id='ticketIfSeats'>" +
            "            <option value='no'>No - seats assigned on first come first served basis</option>" +
            "            <option value='yes'>Yes - seat no. on the ticket</option>" +
            "        </select>" +
            "    </div>" +
            "" +
            "    <div class='form-group col-sm-6'>" +
            "        <div style='margin-left: 5px; margin-top: 8%;'>" +
            "            <label class='text-muted' for='diffSeats' disabled>Specify seats</label>" +
            "            <input type='checkbox' id='diffSeats' value='true' disabled>" +
            "        </div>" +
            "    </div>" +
            "    <div class='form-group col-sm-6'>" +
            "        <label for='ticketNum'>*Number of tickets</label>" +
            "        <input type='number' class='form-control' id='ticketNum'>" +
            "    </div>" +
            "" +
            "    <div class='form-group col-sm-6'>" +
            "        <label for='ticketPrice'>*Price</label>" +
            "        <input type='number' class='form-control' id='ticketPrice'>" +
            "    </div>" +
            "" +
            "" +
            "    <div class='form-group col-sm-12'>" +
            "        <label for='ticketDescription'>Ticket description - optional</label>" +
            "        <textarea class='form-control' id='ticketDescription' rows='4' maxlength='600'></textarea>" +
            "    </div>" +
            "</div>";

        // console.log(output);

        $("#ticketsSell").append(output);

        console.log("End")
    };

});