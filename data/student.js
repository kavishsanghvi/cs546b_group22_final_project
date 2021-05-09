const mongoCollections = require('../config/mongoCollections');
const quizObj = mongoCollections.quiz;
const categoryObj = mongoCollections.users ;
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
    const quizCollection = await quizObj();
    subcategory = []
    const quizData = await quizCollection.find({ category: mainCategory }).toArray();
     for(let i=0;i<quizData.length;i++){
         if(quizData[i].quizReleased == true && quizData[i].quizEnded == false){
           subcategory.push(quizData[i].subCategory)
         }
     }
     console.log(subcategory)
    return subcategory
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