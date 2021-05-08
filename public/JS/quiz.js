    //save in localstore
    var quizDataStr = $('#quizDataStr').val();
    var quizData = JSON.parse(quizDataStr);
    localStorage.setItem("quizDataStr", quizDataStr);

    // Credit: Mateusz Rybczonec
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

    document.getElementById("app").innerHTML = `
        <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
            ></path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
        </div>`;

    startTimer();

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
            setCircleDasharray();
            setRemainingPathColor(timeLeft);
            //console.log(timeLeft);
            localStorage.setItem('timer', Number(timeLeft) / 60);
            //console.log( Number(localStorage.getItem('timer'))/60);
            if (timeLeft === 0) {
                onTimesUp();
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

    function setRemainingPathColor(timeLeft) {
        const {
            alert,
            warning,
            info
        } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }



//Added by Devendra 05/05/2021 
$("#question0").css("display", "block");


$(".quizSubmit").submit(function (event) {
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
            "selectedAns": radioValue ? radioValue : "",
            "quizId" : quizData.quizId,
            "id" : quizData._id
        },
        dataType: "json"
    });

    request.done(function (showsData) {
        alert(JSON.stringify(showsData));
        id1.css("display", "none");
        id2.css("display", "block");
        if(isLastQuiz) location.reload();
        if (showsData) {} else {}
    });

    request.fail(function (jqXHR, textStatus) {
        console.log(textStatus)
        $("#site-error").text("Error in loading show detail.").show();
        //alert("Request failed: " + textStatus);
    });
    event.preventDefault();
})