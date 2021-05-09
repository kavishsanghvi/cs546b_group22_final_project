$(".verifyClass").click(function () {
    let dataValue = $(this).data("id");
    // console.log($(this).data("id"));
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

// $(".disableToggleClass").click(function () {
//     // $(document).ready(function () {
//     //     $('#container').append('<button class="btn-styled" type="button">Press me</button>');
//     // });

//     let dataIDValue = $(this).data("id");
//     let dataValue = $(this).data("value");
//     // let enableTimerDataValue = $("button.enableToggleClass").data("value");
//     console.log($(this).data("id"));
//     console.log($(this).data("value"));
//     if (dataValue) {
//         var request = $.ajax({
//             url: "/quiz/allquiz/toggleTimer",
//             method: "POST",
//             data: { dataid: dataIDValue, dataVal: dataValue },
//             dataType: "json"
//         });

//         request.done(function (msg) {
//             console.log(msg)
//             if (dataValue) {
//                 console.log($("button.enableToggleClass").data("value"));
//                 // console.log(enableTimerDataValue);
//                 // console.log($("button.enableToggleClass[data-id='" + dataIDValue + "'][data-value='" + $("button.enableToggleClass").data("value") + "']"));
//                 // $("button.enableToggleClass[data-id=6089efc620cabb53f8733f8c][data-value=false]").show();
//                 $("button.disableToggleClass[data-id='" + dataIDValue + "'][data-value='" + dataValue + "']").hide();

//                 // $(document).ready(function () {
//                 $('li').find('[data-id=' + dataIDValue + ']').parent().append('<button type="submit" class="btn btn-primary enableToggleClass" data-id=' + dataIDValue + ' data-value=' + msg.status + ' id = "timerToggleID" > Enable Timer</button > ');
//                 // });


//                 // $("button.enableToggleClass[data-id='" + dataIDValue + "']").show();
//                 alert(msg.message)
//             } else {
//                 // $("button[data-id='" + dataIDValue + "']").prop('disabled', false);
//                 alert(msg.message)
//             }
//         });

//         request.fail(function (jqXHR, textStatus) {
//             console.log(textStatus)
//             alert("Request failed: " + textStatus);
//         });
//     }
// });

// $(".enableToggleClass").click(function () {
//     // $(document).ready(function () {
//     //     $('#container').append('<button class="btn-styled" type="button">Press me</button>');
//     // });

//     let dataIDValue = $(this).data("id");
//     let dataValue = $(this).data("value");
//     // let enableTimerDataValue = $("button.enableToggleClass").data("value");
//     console.log($(this).data("id"));
//     console.log($(this).data("value"));
//     if (!dataValue) {
//         var request = $.ajax({
//             url: "/quiz/allquiz/toggleTimer",
//             method: "POST",
//             data: { dataid: dataIDValue, dataVal: dataValue },
//             dataType: "json"
//         });

//         request.done(function (msg) {
//             console.log(msg)
//             if (!dataValue) {
//                 $("button.enableToggleClass[data-id='" + dataIDValue + "'][data-value='" + dataValue + "']").hide();
//                 $('li').find('[data-id=' + dataIDValue + ']').parent().append('<button type="submit" class="btn btn-primary disableToggleClass" data-id=' + dataIDValue + ' data-value=' + msg.status + ' id = "timerToggleID" > Disable Timer</button > ');
//                 alert(msg.message)
//             } else {
//                 alert(msg.message)
//             }
//         });

//         request.fail(function (jqXHR, textStatus) {
//             console.log(textStatus)
//             alert("Request failed: " + textStatus);
//         });
//     }
// });

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


