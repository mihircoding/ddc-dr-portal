$(document).ready(function () {
    console.log("Ready is called");
   
});
function newPageChange() {
    location.href = "form.html";
};
function buttonPressing () {
    var method = 'POST'
    var url = 'http://localhost:5000/buttonpress';
    var myObject = new FormData();
    var holdervar1 = $(`#file`)[0].files;
    console.log(holdervar1);
    myObject.append('file',holdervar1[0]);
    console.log("calling ajax");
    callAjax(url,method, myObject).
    done(function(data, textStatus, jqXHR) {
        console.log("called ajax done");
        location.href = "form.html?FirstName=" + data.FirstName + "&LastName=" + data.LastName;
        $(`#FirstName`).val(info[0].first);
    });
}


function callAjax(uri, method, formData) {
    return $.ajax({
    url: uri,
    crossDomain:true,
    //dataType: 'json',
    contentType: false,
    processData: false,
    accepts:'application/json',
    data: formData,
    type: method
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        $('#info').html('<p>An error has occurred</p>');
        alert('I am in ajax error');
    })
    .always(function(data, textStatus, jqXHR) {
        console.log("cleanup done");
        // do any cleanup
    });
}