$(document).ready(function() {
    getCategories();

// -- TIGGERS --
//

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
                "<a href='/grid' class='list-group-item list-group-item-action sub'>"+category+"</a>";
        }
        $("#sidebarCategories").html(output);
    }

});