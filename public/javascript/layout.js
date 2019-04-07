$(document).ready(function() {
    getCategories();

// -- TRIGGERS --
    $(".deleteItem").click(function () {
        var tid = $(this).attr("tid");
        var username = $("#username").attr("username");
        var parent = $(this).parent().parent();

        $.ajax({
            url: "/api/users/" + username + "/cart/" + tid,
            type: "DELETE",
            success: function (res) {
                parent.remove();
                //TODO update element numbers
            }
        });

    });

    $("#searchBarInput").on("keydown", function () {
        console.log(event.target.value);
        var searchText = event.target.value;
        $("#searchBtn").attr({href:"/list?q="+event.target.value});
    });

    $('#searchBar').on("submit",function(e) {
        e.preventDefault()
        var searchText = document.getElementById("searchBarInput").value;
        window.location.href = "/list?q="+searchText;
        });



// -- FUNCTIONS --

//    get Categories
    function getCategories(){
        $.ajax({
            type: 'GET',
            url: 'api/categories',
            dataType: 'json',
            success: function (res) {
                sidebarDisplay(res)
            }
        });
    }

//    display categories on the page
    function sidebarDisplay(cat) {
        var output="";

        for(var i=0; i<cat.length; i++){
            var category= cat[i].name;
            output+=
                "<a href='/list?category="+category+"' class='list-group-item list-group-item-action sub'>"+category+"</a>";
        }
        $("#sidebarCategories").html(output);
    }
});

var total = 0;
var i = 0;
function setupCartDetails(id, quantity) {
    var size = $("#cartAmount").html();


    $.ajax({
        url: "/api/tickets/" + id,
        type: "GET",
        success: function (resp) {

            $.ajax({
                url: "/api/events/" + resp.eventID,
                type: "GET",
                success: function (event) {
                    if (i === parseInt(size)) {
                        i = 0;
                        total = 0;
                    }

                    $("." + id + "-price").html("€" + resp.price);
                    $("." + id + "-name").html(event[0].name);

                    total += resp.price * quantity;
                    $(".subtotal").html("€" + total);
                    i++;
                }
            });


        }
    });

}