/**
 * Created by mike on 2017-10-05.
 */



$(document).ready(function() {
    $("#banner-owl").owlCarousel({
        pagination: false,
        rewindNav: true,
        touchDrag: false,
        mouseDrag: false,
        loop: true,
        autoPlay: 4000,
        items: 1,
        itemsDesktop: [1200, 1],
        itemsDesktopSmall: [1024, 1],
        itemsTablet: [768, 1],
        itemsMobile: [480, 1]
    });


    $("#banner-owl-2").owlCarousel({
        pagination: true,
        rewindNav: true,
        touchDrag: false,
        mouseDrag: false,
        loop: true,
        autoPlay: 4000,
        items: 1,
        itemsDesktop: [1200, 1],
        itemsDesktopSmall: [1024, 1],
        itemsTablet: [768, 1],
        itemsMobile: [480, 1]
    });


    $('.game-toggle').click(function(){
        $(this).find('i').toggleClass('fa-angle-down fa-angle-up');
        $(this).parent().next().slideToggle();
    });
});

$(document).ready(function () {
    $('.search-bar').typeahead({
        name: 'Products',
        local: [""]
    }).on('typeahead:selected', function (object, datum) {
        $(this).closest('form').submit();
    });
});


(function() {
    var toggles = document.querySelectorAll(".c-hamburger");

    for (var i = toggles.length - 1; i >= 0; i--) {
        var toggle = toggles[i];
        toggleHandler(toggle);
    }

    function toggleHandler(toggle) {
        toggle.addEventListener( "click", function(e) {
            e.preventDefault();
            if (this.classList.contains("is-active") === true ) {
                this.classList.remove("is-active");

            } else {
                this.classList.add("is-active");

            }
        });
    }
})();

