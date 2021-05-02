const usersData = require("./users");
const loginData = require("./login");
const createCategoryData = require("./createCategory")
const createQuizData = require("./createQuiz")
const quizDataIndex = require("./quizData")

module.exports = {
    users: usersData,
    login: loginData,
    createCategory: createCategoryData,
    retriveQuizData: quizDataIndex,
    createQuiz: createQuizData
}