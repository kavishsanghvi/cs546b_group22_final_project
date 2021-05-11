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
                // if ($("button.disableToggleClass[data-id='" + dataIDValue + "']").length > 0)
                //     $("button.disableToggleClass[data-id='" + dataIDValue + "']").hide();
                // else if ($("button.enableToggleClass[data-id='" + dataIDValue + "']").length > 0)
                //     $("button.enableToggleClass[data-id='" + dataIDValue + "']").hide();
                // $("button.quizReleaseToggleClass[data-id='" + dataIDValue + "'][data-value='" + dataValue + "']").hide();
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