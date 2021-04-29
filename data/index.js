const usersData = require("./users");
const loginData = require("./login");
const createCategoryData = require("./create_category")
const quizDataIndex = require("./quizData")

module.exports = {
    users: usersData,
    login: loginData,
    create_category: createCategoryData,
    retriveQuizData: quizDataIndex
}