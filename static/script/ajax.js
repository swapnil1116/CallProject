// AJAX FROM HERE
$(document).ready(function(){
    $("form#changeQuote").on('submit', function(e,callback){
        e.preventDefault();
        var data = {};
        data.quote = $('input[name=quote]').val();
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8000/ajax',
            data: data,
            dataType: 'text'
        }).done(function(data){
            console.log($(data)[6].children[0].innerText)
            $('h1 span').html($(data)[6].children[0].innerText);
        });
    });
});
