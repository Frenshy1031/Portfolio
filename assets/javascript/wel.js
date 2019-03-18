 $(function() {
setTimeout(function(){
    $('.fly-in-text').removeClass('hidden');
}, 500);
enterbutton.on('click', function(e) {
    e.preventDefault();
    welcomeSection.addClass('content-hidden').fadeOut();
});

})();
