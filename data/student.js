const mongoCollections = require('../config/mongoCollections');
const quizObj = mongoCollections.quiz;
const categoryObj = mongoCollections.users ;
const submitedObj = mongoCollections.studentSubmittedQuiz;
let { ObjectId } = require('mongodb');


const getCategoryData = async function getCategoryData(session) {
   try{   
   if(session.userID){
    let parsedId = ObjectId(session.userID)
    const categoryCollection = await categoryObj();
   const getAllData = await categoryCollection.findOne({ _id: parsedId });
    if(getAllData.enrolledIn){
        getStudentCategories = getAllData.enrolledIn
    }
    console.log(getAllData.enrolledIn)
    return getStudentCategories
    }
}
catch (e) {
    return e
}
}

const getSubCategoryOfCategory = async function getSubCategoryOfCategory(session, mainCategory) {
    try{
    if(session.userID){
        let given=[]
        let notgiven=[]
    let parsedId = ObjectId(session.userID)
    const quizCollection = await quizObj();
    const submitedCollection = await submitedObj();
    subcategory = []
    const submited = await submitedCollection.find({ userid: parsedId }).toArray();
    const quizData = await quizCollection.find({ category: mainCategory }).toArray();
     for(let i=0;i<quizData.length;i++){
         if(quizData[i].quizReleased == true && quizData[i].quizEnded == false){
           subcategory.push(quizData[i].subCategory)
         }
     }
     for(let j=0;j<submited.length;j++){         
         for(let k=0;k<subcategory.length;k++){
             if(submited[j].subCategory == subcategory[k]){
                 given.push(subcategory[k])
             }
         }
     }

    function arr_diff (a1, a2) {

        var a = [], diff = [];
    
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
    
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
    
        for (var k in a) {
            diff.push(k);
        }
        return diff;
    }
    
    notgiven = (arr_diff(given.sort(), subcategory.sort()));
     return notgiven
        }
    }
    catch (e){
        return e
    }
}

module.exports = {
    getCategoryData,
    getSubCategoryOfCategory
   
}