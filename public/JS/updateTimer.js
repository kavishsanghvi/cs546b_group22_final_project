$('#todoArea').on('click', '.disableToggleClass', function () {
    console.log("Disable")
    let dataIDValue = $(this).data("id");
    let dataValue = $(this).data("value");
    if (dataValue) {
        var request = $.ajax({
            url: "/professor/allquiz/toggleTimer",
            method: "POST",
            data: { dataid: dataIDValue, dataVal: "Timer" },
            dataType: "json"
        });

        request.done(function (msg) {
            console.log(msg)
            if (dataValue) {
                $("button.disableToggleClass[data-id='" + dataIDValue + "'][data-value='" + dataValue + "']").hide();
                $('li').find('[data-id=' + dataIDValue + ']').parent().append('<button type="submit" class="btn btn-primary enableToggleClass" data-id=' + dataIDValue + ' data-value=' + msg.status + ' id = "timerToggleID" > Enable Timer</button > ');
                alert(msg.message)
                location.reload()
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

$('#todoArea').on('click', '.enableToggleClass', function () {
    console.log("Enable")
    let dataIDValue = $(this).data("id");
    let dataValue = $(this).data("value");
    if (!dataValue) {
        var request = $.ajax({
            url: "/professor/allquiz/toggleTimer",
            method: "POST",
            data: { dataid: dataIDValue, dataVal: "Timer" },
            dataType: "json"
        });

        request.done(function (msg) {
            console.log(msg)
            if (!dataValue) {
                $("button.enableToggleClass[data-id='" + dataIDValue + "'][data-value='" + dataValue + "']").hide();
                $('li').find('[data-id=' + dataIDValue + ']').parent().append('<button type="submit" class="btn btn-primary disableToggleClass" data-id=' + dataIDValue + ' data-value=' + msg.status + ' id = "timerToggleID" > Disable Timer</button > ');
                alert(msg.message)
                location.reload()
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

$('#todoArea').on('click', '.quizReleaseToggleClass', function () {
    let dataIDValue = $(this).data("id");
    let dataValue = $(this).data("value");
    console.log($("button.enableToggleClass[data-id='" + dataIDValue + "']").length)
    if (!dataValue) {
        var request = $.ajax({
            url: "/professor/allquiz/toggleTimer",
            method: "POST",
            data: { dataid: dataIDValue, dataVal: "Release" },
            dataType: "json"
        });

        request.done(function (msg) {
            console.log(msg)
            if (!dataValue) {
                if ($("button.disableToggleClass[data-id='" + dataIDValue + "']").length > 0)
                    $("button.disableToggleClass[data-id='" + dataIDValue + "']").hide();
                else if ($("button.enableToggleClass[data-id='" + dataIDValue + "']").length > 0)
                    $("button.enableToggleClass[data-id='" + dataIDValue + "']").hide();
                $("button.quizReleaseToggleClass[data-id='" + dataIDValue + "'][data-value='" + dataValue + "']").hide();
                alert(msg.message)
                location.reload()
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