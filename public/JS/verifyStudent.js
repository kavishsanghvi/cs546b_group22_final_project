$(".verifyClass").click(function () {
    let dataValue = $(this).data("id");
    if (dataValue) {
        var request = $.ajax({
            url: "/professor/verifyStudent/",
            method: "POST",
            data: { dataid: dataValue },
            dataType: "json"
        });

        request.done(function (msg) {
            console.log(msg)
            if (msg.status) {
                $("button[data-id='" + dataValue + "']").remove();
                alert(msg.message)
            } else
                alert(msg.message)
        });

        request.fail(function (jqXHR, textStatus) {
            console.log(textStatus)
            alert("Request failed: " + textStatus);
        });
    }
});