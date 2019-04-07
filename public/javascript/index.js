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
                gridDisplay(res);
                updateSlider();
            }
        });
    }

//    display categories on the page
    function gridDisplay(cat) {
        var output=
            "<div class='swiper-slide'>" +
            "    <div class='row no-gutters gutters-1'>";

        for(var i=0; i<cat.length; i++){
            var category= cat[i].name;
            if(i%4===0 && i>0){
                output+=
                    "    </div>"+
                    "</div>"+
                    "<div class='swiper-slide'>" +
                    "    <div class='row no-gutters gutters-1'>";
            }

            output+=
                "<div class='col-6 col-md-3 mb-1'>" +
                "    <a href='/list?category="+category+"' class='card'>" +
                "        <img src='images/categories/"+category+".jpeg' alt='' class='card-img-top'>" +
                "        <div class='card-img-overlay card-img-overlay-bottom p-2 primary'>" +
                "            <h5>"+category+"</h5>" +
                "        </div>" +
                "   </a>" +
                "</div>";
        }
        output+=
            "    </div>"+
            "</div>";
        $("#categoryGrid").html(output);
    }

    function updateSlider() {
        var categoriesSlider = new Swiper('#categories-slider', {
            navigation: {
                prevEl: '#categories-slider-prev',
                nextEl: '#categories-slider-next'
            }
        });
        categoriesSlider.update();
    }


});