$('#studentSelectCategory').on('click', '.submitStudentCategoryData', function () {
    let dataIDValue = $('#category_name_list').find(':selected').data('id');
    let dataValue = $('#category_name_list').find(':selected').data('value')
    // console.log($("button.enableToggleClass[data-id='" + dataIDValue + "']").length)
    if (dataIDValue) {
        var request = $.ajax({
            url: "/student/enroll-now",
            method: "POST",
            data: { dataid: dataIDValue, dataValue: dataValue },
            dataType: "json"
        });

        request.done(function (msg) {
            console.log(msg)
            if (msg) {
                alert(msg.message)
            } else {
                alert(msg.message)
            }
        });

        request.fail(function (jqXHR, textStatus) {
            console.log(textStatus)
            alert("Request failed: " + textStatus);
        });
    }
});