    //save in localstore
    var quizDataStr = $('#quizDataStr').val();
    var quizData = JSON.parse(quizDataStr);
    localStorage.setItem("quizDataStr", quizDataStr);


    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;

    const COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };


    //Devendra
    let QUIZ_TIME;
    if (localStorage.getItem('timer') && !isNaN(localStorage.getItem('timer')) && (localStorage.getItem('timer') !== "")) {
        QUIZ_TIME = localStorage.getItem('timer');
    } else {
        localStorage.setItem("timer", (JSON.parse(localStorage.getItem('quizDataStr'))).timer);
        localStorage.setItem("TotalTime", (JSON.parse(localStorage.getItem('quizDataStr'))).timer);
        QUIZ_TIME = localStorage.getItem('timer');
    }
    const TIME_LIMIT = Number(QUIZ_TIME) * 60;
    let timePassed = Number(localStorage.getItem('timer')) - Number(QUIZ_TIME);
    //Devendra
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    if(quizData.isTimerEnabled && quizData.isTimerEnabled==true){
        document.getElementById("app").innerHTML = `
        <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>`;
        startTimer();
    }

    function onTimesUp() {
        clearInterval(timerInterval);
    }

    function startTimer() {
        timerInterval = setInterval(() => {

            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(
                timeLeft
            );
            // setCircleDasharray();
            // setRemainingPathColor(timeLeft);
            //console.log(timeLeft);
            //localStorage.setItem('timer', Number(timeLeft) / 60);
            //console.log( Number(localStorage.getItem('timer'))/60);
            //alert(timeLeft);
            if (timeLeft === 0) {
                onTimesUp();
            }
            if (timeLeft === 3500) {
                $("#alertWarning").html("5 Minute remaining.").css('color','red').fadeOut(10000);
            }

            if (timeLeft === 3300) {
                $("#alertWarning").html("Time up your quiz will auto submit.").css('color','red').fadeOut(5000);
                $("#submitButton").trigger("click");
            }
        }, 1000);
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    }

    

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }




//Added by Devendra 05/05/2021 
$("#question0").css("display", "block");
$("#submitButton").hide();

let questionCount = (JSON.parse(localStorage.getItem("quizDataStr"))).questions.length;
for(let i=1; i<=questionCount; i++){
    $("#questionQuiclLink").append('<li class="list-group-item changeQuestion" data-id="'+(Number(i)-1)+'" >Question('+i+') </li>');
}

$(".changeQuestion").click(function (event){
    let questionId = $(this).data("id");
    for(let i=0; i<questionCount; i++){
        $("#question"+i+"").hide();
    }
    $("#question"+questionId+"").show();
})

$(".quizSubmit").submit(function (event) {
    // let rr = confirm("Please press ok if you are submitting quiz.");
    // if(rr == false){
    //     event.preventDefault();
    //     return;
    // } 

    let qID = $(this).attr("id");
    let id1 = $("#question" + qID);
    let id2 = $("#question" + (Number(qID) + 1));
    
    let quizData = (JSON.parse(localStorage.getItem("quizDataStr")));
    let isLastQuiz = false 
    if(quizData.questions.length == (Number(qID)+1)){
        isLastQuiz =  true;
    }

    let radioName = "answerChoice" + $(this).attr("id");
    let questionId = $(this).data("id");
    let radioValue = $("input[name='" + radioName + "']:checked").val();
    if (radioValue) {
        //alert("Your are a - " + radioValue);
    }
    if (questionId) {
        //alert(questionId);
    }

    var request = $.ajax({
        url: "../quiz-student-update",
        method: "POST",
        data: {
            "questionId": questionId,
            "selectedAns": radioValue ? radioValue : "",
            "quizId" : quizData.quizId,
            "id" : quizData._id
        },
        dataType: "json"
    });

    request.done(function (showsData) {
        if(isLastQuiz){
            $("#submiButton").attr("data-value", "submitQuiz");
            $("#submitButton").show();
        }

        id1.css("display", "none");
        id2.css("display", "block");
        if (showsData) {} else {}
        //alert(JSON.stringify(showsData));
    });

    request.fail(function (jqXHR, textStatus) {
        console.log(textStatus)
        $("#site-error").text("Error in loading show detail.").show();
        //alert("Request failed: " + textStatus);
    });
    event.preventDefault();
})


$("#submitButton").click(function (event) {
    let rr = confirm("Please press ok if you are submitting quiz.");
    if(rr == false){
        event.preventDefault();
        return;
    } 
    let quizData = (JSON.parse(localStorage.getItem("quizDataStr")));

    let request = $.ajax({
        url: "../quiz-student-submit",
        method: "POST",
        data: {
            "quizId" : quizData.quizId,
            "id" : quizData._id
        },
        dataType: "json"
    });


    request.done(function (showsData) {
        // if(isLastQuiz){
        //     $("#submiButton").attr("data-value", "submitQuiz");
        // }

        //alert(JSON.stringify(showsData));
        // id1.css("display", "none");
        // id2.css("display", "block");
       // if(isLastQuiz) 
       //location.reload();
       //if(isLastQuiz) 
       location.reload();
        if (showsData) {} else {}
    });

    request.fail(function (jqXHR, textStatus) {
        console.log(textStatus)
        $("#site-error").text("Error in loading show detail.").show();
        //alert("Request failed: " + textStatus);
    });
    event.preventDefault();
})

