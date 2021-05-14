const mongoCollections = require('../config/mongoCollections');
const quizObj = mongoCollections.quiz;
const categoryObj = mongoCollections.users ;
const submitedObj = mongoCollections.studentSubmittedQuiz;
let { ObjectId } = require('mongodb');
const utilsObj = require('./utils')

const getCategoryData = async function getCategoryData(session) {
   if(session.userID){
    let parsedId = ObjectId(session.userID)
    const categoryCollection = await categoryObj();
   const getAllData = await categoryCollection.findOne({ _id: parsedId });
   if(getAllData.isActive === false) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're enrollment is not yet confirmed by any professor." }
    if(getAllData.enrolledIn){
        getStudentCategories = getAllData.enrolledIn
    }
    getStudentCategories1=[]
    for(let i=0;i<getStudentCategories.length;i++){
        getStudentCategories1[i]= (getStudentCategories[i].categoryName)
    }
    return getStudentCategories1
    }
}

const getSubCategoryOfCategory = async function getSubCategoryOfCategory(session, mainCategory) {
    try {
        if (session.userID) {
            let checkmainCategory = await utilsObj.variableSanityCheck(mainCategory, "string", "Category");
            if (checkmainCategory.result) mainCategory = checkmainCategory.value
            else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }
            let given = []
            let notgiven = []
            let parsedId = ObjectId(session.userID)
            const quizCollection = await quizObj();
            const submitedCollection = await submitedObj();
            subcategory = []
            const submited = await submitedCollection.find({ userid: parsedId }).toArray();
            const quizData = await quizCollection.find({ category: mainCategory }).toArray();
            for (let i = 0; i < quizData.length; i++) {
                if (quizData[i].quizReleased == true && quizData[i].quizEnded == false) {
                    subcategory.push({ subCategory: quizData[i].subCategory, quizID: quizData[i]._id.toString() })
                }
            }
            for (let j = 0; j < submited.length; j++) {
                for (let k = 0; k < subcategory.length; k++) {
                    if (submited[j].quizId.toString() == subcategory[k].quizID) {
                        given.push({ subCategory: subcategory[k].subCategory, quizID: subcategory[k].quizID })
                    }
                }
            }

            notgiven = subcategory.filter(({ quizID: valueOne }) => !given.some(({ quizID: valueTwo }) => valueTwo === valueOne));

            if(notgiven.length === 0)
                return { data: notgiven, "result": true, statusCode: 200, "message": "No quizzes have been added by the professor yet!!", error: "" }
            else if (notgiven.length > 0)
                return { data: notgiven, "result": true, statusCode: 200, "message": "", error: "" }
        }
    }
    catch (e) {
        return { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
    }
}

module.exports = {
    getCategoryData,
    getSubCategoryOfCategory
   
}