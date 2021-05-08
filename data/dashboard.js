const mongoCollections = require('../config/mongoCollections');
const quizObj = mongoCollections.studentSubmittedQuiz;
let { ObjectId } = require('mongodb');

const getQuizData = async function getQuizData(session) {
    let myresult = {}
    let score = []
    if (session) {
        if (!session.userID) throw 'Invalid userID';
        let parsedId = ObjectId(session.userID)
        const quizCollection = await quizObj();
        const quiz = await quizCollection.find({ userid: parsedId }).toArray();
        const groupbycategory = await quizCollection.distinct("category")
        const groupbysub = await quizCollection.distinct("subCategory")

        for (let i = 0; i < quiz.length; i++) {
            for (let j = 0; j < groupbycategory.length; j++) {
                for (let k = 0; k < groupbysub.length; k++) {
                    if (quiz[i].subCategory == groupbysub[k] && quiz[i].category == groupbycategory[j]) {
                        myresult.cat = quiz[i].category
                        myresult.subCat = quiz[i].subCategory
                        myresult.tstScore = quiz[i].totalScore
                        score.push(Object.assign(i, myresult))

                    }
                }
            }
        }
        return score
    }
}

module.exports = {
    getQuizData
}