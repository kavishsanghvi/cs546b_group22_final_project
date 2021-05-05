$("#question0").css("display", "block");


$(".quizSubmit").submit(function (event) {
    let qID = $(this).attr("id");
    let id1 = $("#question" + qID);
    let id2 = $("#question" + (Number(qID) + 1));
    id1.css("display", "none");
    id2.css("display", "block");

    let radioName = "answerChoice" + $(this).attr("id");
    let questionId = $(this).data("id");
    let radioValue = $("input[name='" + radioName + "']:checked").val();
    if (radioValue) {
        alert("Your are a - " + radioValue);
    }
    if (questionId) {
        alert(questionId);
    }

    var request = $.ajax({
        url: "./quiz-student-update",
        method: "POST",
        data: {
            "questionId": questionId,
            "selectedAns": radioValue ? radioValue : ""
        },
        dataType: "json"
    });

    request.done(function (showsData) {
        alert(showsData);

        if (showsData) {} else {}
    });

    request.fail(function (jqXHR, textStatus) {
        console.log(textStatus)
        $("#site-error").text("Error in loading show detail.").show();
        //alert("Request failed: " + textStatus);
    });
    event.preventDefault();
})