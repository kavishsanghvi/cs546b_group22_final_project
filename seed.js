const mongoCollections = require('./config/mongoCollections');
const quizObj = mongoCollections.quiz;
const categoryObj = mongoCollections.categories;
const ObjectID = require('mongodb').ObjectID;
const utils = require('./data/utils');
const data = require('./data');
const userData = data.users;


const professorOneData = {
	firstName: "Patrick",
	lastName: "Hill",
	email: "phill@stevens.edu",
	userType: "professor",
	password: "Dharma@2021",
	universityName: "Stevens Institute of Technology",
}

let professorOneCategoryData = {
	category: "web programming",
	subCategory: "html",
	universityDomain: "stevens.edu",
	professorName: "Patrick Hill",
	createdBy: "609f3f203f43dd81fb0461d0"
}

let professorOneQuizData = {
	"category": "web programming",
	"subCategory": "html",
	"startDate": "05/18/2021",
	"endDate": "06/20/2021",
	"timer": "32",
	"isTimerEnabled": true,
	"quizReleased": false,
	"quizEnded": false,
	"questions": [{
		"questionID": ObjectID(),
		"question": "html stands for what?",
		"answerChoice1": "hypertrophic management language",
		"answerChoice2": "hyperberic tertiary logrithm",
		"answerChoice3": "hypertext markup language",
		"answerChoice4": "hyperresonant marginal logrithm",
		"correctAnswer": "hypertext markup language"
	}, {
		"questionID": ObjectID(),
		"question": "every html document should have what?",
		"answerChoice1": "a head section, and within it a title, followed by a body.",
		"answerChoice2": "a body and header.",
		"answerChoice3": "none of these",
		"answerChoice4": "none of these",
		"correctAnswer": "a body and header."
	}, {
		"questionID": ObjectID(),
		"question": "which tag would be used for a line break?",
		"answerChoice1": "lb",
		"answerChoice2": "br",
		"answerChoice3": "brk",
		"answerChoice4": "ln",
		"correctAnswer": "br"
	}, {
		"questionID": ObjectID(),
		"question": "which of the following html elements is used for making any text bold?",
		"answerChoice1": "p",
		"answerChoice2": "i",
		"answerChoice3": "li",
		"answerChoice4": "b",
		"correctAnswer": "b"
	}],
	"createdBy": "609f3f203f43dd81fb0461d0"
}





const professorTwoData = {
	firstName: "Edward",
	lastName: "Banduk",
	email: "ebanduk@stevens.edu",
	userType: "professor",
	password: "Banduk@2021",
	universityName: "Stevens Institute of Technology"
}

let professorTwoCategoryData = {
	category: "comp organization & prog",
	subCategory: "hardware",
	universityDomain: "stevens.edu",
	professorName: "Edward Banduk",
	createdBy: "60a009d019734920acf9548f"
}


let professorTwoQuizData ={
	"category": "comp organization & prog",
	"subCategory": "hardware",
	"startDate": "05/18/2021",
	"endDate": "06/20/2021",
	"timer": "47",
	"isTimerEnabled": true,
	"quizReleased": false,
	"quizEnded": false,
	"questions": [{
		"questionID": ObjectID(),
		"question": "ram stand for",
		"answerChoice1": "random access memory",
		"answerChoice2": "really awesome monkeys",
		"answerChoice3": "rotten apple money",
		"answerChoice4": "rugs and mud",
		"correctAnswer": "random access memory"
	}, {
		"questionID": ObjectID(),
		"question": "what is the permanent memory built into your computer called?",
		"answerChoice1": "ram",
		"answerChoice2": "cpu",
		"answerChoice3": "cd-rom",
		"answerChoice4": "rom",
		"correctAnswer": "rom"
	}, {
		"questionID": ObjectID(),
		"question": "which part is the \"brain\" of the computer?",
		"answerChoice1": "moniter",
		"answerChoice2": "cpu",
		"answerChoice3": "ram",
		"answerChoice4": "rom",
		"correctAnswer": "cpu"
	}, {
		"questionID": ObjectID(),
		"question": "the capacity of your hard drive is measured in",
		"answerChoice1": "mhz",
		"answerChoice2": "mbps",
		"answerChoice3": "gigabytes",
		"answerChoice4": "52x",
		"correctAnswer": "gigabytes"
	}],
	"createdBy": "60a009d019734920acf9548f"
}




const studentOneData = {
	firstName: "Aditya",
	lastName: "Shivankar",
	email: "ashivank@stevens.edu",
	userType: "student",
	password: "Stevens@2021",
	universityName: "Stevens Institute of Technology"
}


const studentTwoData = {
	firstName: "Kavish",
	lastName: "Sanghvi",
	email: "ksanghv1@stevens.edu",
	userType: "student",
	password: "Stevens@2021",
	universityName: "Stevens Institute of Technology"
}


const studentThreeData = {
	firstName: "Krina",
	lastName: "Shah",
	email: "kshah119@stevens.edu",
	userType: "student",
	password: "Stevens@2021",
	universityName: "Stevens Institute of Technology"
}

const studentFourData = {
	firstName: "Yash",
	lastName: "Patole",
	email: "ypatole@stevens.edu",
	userType: "student",
	password: "Stevens@2021",
	universityName: "Stevens Institute of Technology"
}


const studentFiveData = {
	firstName: "Oliva",
	lastName: "Montero",
	email: "omontero@pace.edu",
	userType: "student",
	password: "Pace@2021",
	universityName: "Pace University"
}

const studentSixData = {
	firstName: "Devendra",
	lastName: "Chauhan",
	email: "dchauha3@stevens.edu",
	userType: "student",
	password: "Stevens@2021",
	universityName: "Stevens Institute of Technology"
}

const seedUsersData = async (user) => {
    try {
        const userDetail = user;
        const { firstName, lastName, email, userType, password, universityName } = userDetail;
        const newUser = await userData.createnewuser(firstName, lastName, email, userType, password, universityName);
        if(newUser.result){
            console.log('User created.');
        }
        return newUser;
    } catch (e) {
        console.log(e);
    }
}


const main = async ()=>{
    try{
        console.log("Seedind begins")
        let userOne = await seedUsersData(professorOneData);
        if(userOne && userOne.result){
                        
            professorOneCategoryData.createdBy = ObjectID(userOne.data._id)
            const categoryCollections = await categoryObj();
            let insertCate = await categoryCollections.insertOne(professorOneCategoryData);

            professorOneQuizData.createdBy = ObjectID(userOne.data._id)
            professorOneQuizData.startDate = await utils.dateCreationOnly("startDate");
            const quizCollections = await quizObj();
            let insertQuiz = await quizCollections.insertOne(professorOneQuizData);

        }


        let userTwo = await seedUsersData(professorTwoData);
        if(userTwo && userTwo.result){            
            professorTwoCategoryData.createdBy = ObjectID(userTwo.data._id)
            const categoryCollections = await categoryObj();
            let insertCate = await categoryCollections.insertOne(professorTwoCategoryData);

            professorTwoQuizData.createdBy = ObjectID(userTwo.data._id)
            professorTwoQuizData.startDate = await utils.dateCreationOnly("startDate");
            const quizCollections = await quizObj();
            let insertQuiz = await quizCollections.insertOne(professorTwoQuizData);
        }


        await seedUsersData(studentOneData);
        await seedUsersData(studentTwoData);
        await seedUsersData(studentThreeData);
        await seedUsersData(studentFourData);
        await seedUsersData(studentFiveData);
        await seedUsersData(studentSixData);

        console.log("Seeding ended.")
    }catch(e){
        console.log(e);
    }
}

main();