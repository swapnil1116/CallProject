function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('.preview-vehicle-image')
                .attr('src', e.target.result)
                .addClass("preview-image-responsive-class")
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$("#capture-image").change(function() {
    filename = this.files[0].name
    console.log(filename);
});