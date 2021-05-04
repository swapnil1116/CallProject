

$("#add_user").submit(function(event){
    alert("Product Inserted Succesfully!")
})

$("#edit_product").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n , i){
        data[n['name']] = n['value']
    })

    console.log(data);

    var request = {
        "url" : `/api/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully")
    })
})