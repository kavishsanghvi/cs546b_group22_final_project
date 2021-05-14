const mongoCollections = require('../config/mongoCollections');
const quizObj = mongoCollections.quiz;
const usersObj = mongoCollections.users;
const categoryObj = mongoCollections.categories;
const objOfObjectID = require('mongodb').ObjectID;
const creatingpswd = require('./bcrypt');
const mongocall = require("mongodb");
const utilsObj = require('./utils')

const addUserData = async function addUserData(userInfo) {
    let localUsersObj = await usersObj();
    let addUser = await localUsersObj.insertOne(userInfo);
    if (addUser.insertedCount === 0) throw 'Could not add post';
    return JSON.parse(JSON.stringify(addUser.ops[0]));
}

const getQuiz = async function getQuiz() {
    let quizObjData = await quizObj();
    const getAllUsersData = await quizObjData.find({}).toArray();
    return getAllUsersData[0];
}

const getProfessorData = async function getProfessorData(session) {
    const localUsersObj = await usersObj();
    if (session.userID) {
        const getProfessorDetails = await localUsersObj.findOne({ $and: [{ _id: objOfObjectID(session.userID), userType: "professor" }] });
        return getProfessorDetails;
    } else throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
}

const getStudentRecord = async function getStudentRecord(session, studentUserIDs) {
    if(!session.userID) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }

    const localUsersObj = await usersObj();
    const getStudentRecord = []
    for (let i = 0; i < studentUserIDs.length; i++) {
        getStudentRecord.push(Object.assign(studentUserIDs[i], await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) })));
    }
    return getStudentRecord;
}

const getCategoryData = async function getCategoryData(session, reqType) {
    if (session.userID) {
        let checkreqType = await utilsObj.variableSanityCheck(reqType, "string", "Value");
        if (checkreqType.result) reqType = checkreqType.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

        const localCategoryObj = await categoryObj();
        let getProfessorCategories = await localCategoryObj.distinct(reqType, { createdBy: objOfObjectID(session.userID) })

        if (getProfessorCategories.length === 0)
            return { data: getProfessorCategories, "result": true, statusCode: 200, "message": "No categories added yet. Please add a category first.", error: "" }
        if (getProfessorCategories.length > 0)
            return { data: getProfessorCategories, "result": true, statusCode: 200, "message": "", error: "" }
    } else throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
}

const getSubCategoryOfCategory = async function getSubCategoryOfCategory(session, mainCategory, subCategory) {
    if(!session.userID) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
    let checkmainCategory = await utilsObj.variableSanityCheck(mainCategory, "string", "Category");
    if (checkmainCategory.result) mainCategory = checkmainCategory.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

    let checkSubCategory = await utilsObj.variableSanityCheck(subCategory, "string", "Sub Category");
    if (checkSubCategory.result) subCategory = checkSubCategory.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

    const localCategoryObj = await categoryObj();
    let getProfessorCategories = await localCategoryObj.distinct(subCategory, { createdBy: objOfObjectID(session.userID), category: mainCategory })
    if (getProfessorCategories.length === 0)
        return { data: getProfessorCategories, "result": true, statusCode: 200, "message": "No sub categories added yet. Please add a category first.", error: "" }
    if (getProfessorCategories.length > 0)
        return { data: getProfessorCategories, "result": true, statusCode: 200, "message": "", error: "" }
}

const getAllStudentUnderProfessorData = async function getAllStudentUnderProfessorData(session) {
    if (session.userID) {
        let returnDataFromProfessor = await getProfessorData(session);
        const getStudentsUnderProfessorRecord = []
        if (returnDataFromProfessor.enrolledStudents) {
            for (let i = 0; i < Object.keys(returnDataFromProfessor.enrolledStudents).length; i++) {
                let keyName = Object.keys(returnDataFromProfessor.enrolledStudents)[i];
                for (let j = 0; j < returnDataFromProfessor.enrolledStudents[keyName].length; j++) {
                    getStudentsUnderProfessorRecord.push(returnDataFromProfessor.enrolledStudents[keyName][j])
                }
            }
            let returnStudentData = await getOneStudentRecord(session, getStudentsUnderProfessorRecord);
            // To check the new return below line is working:
            // return returnStudentData
            if (returnStudentData.length === 0)
                return { data: returnStudentData, "result": true, statusCode: 200, "message": "No Record Found!!", error: "" }
            if (returnStudentData.length > 0)
                return { data: returnStudentData, "result": true, statusCode: 200, "message": "", error: "" }
        } else
            throw { "result": false, statusCode: 404, "message": "", error: "No students enrolled yet!!" };
    } else throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
}

const getOneStudentRecord = async function getOneStudentRecord(session, studentUserIDs) {
    let localUsersObj = await usersObj();
    const getStudentRecord = []
    for (let i = 0; i < studentUserIDs.length; i++)
        getStudentRecord.push(await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i]) }));
    return getStudentRecord;
}

const fetchStudentData = async function fetchStudentData(id) {
    let localUsersObj = await usersObj();
    return await localUsersObj.findOne({ _id: objOfObjectID(id) })
}

const updateStudentStatus = async function updateStudentStatus(session, id) {
    let checkID = await utilsObj.variableSanityCheck(id, "ObjectID", "ID");
    if (checkID.result) id = checkID.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid ID.", userData: null }

    if (session.userType === "professor") {
        let getStudentData = await fetchStudentData(id);
        let result = { status: false, message: "" }
        if (getStudentData.isActive == false) {
            let localUsersObj = await usersObj();
            const updateisActiveIntoDB = await localUsersObj.updateOne({ _id: objOfObjectID(id) }, { $set: { "isActive": true } });
            if (updateisActiveIntoDB.modifiedCount === 0)
                return { data: updateisActiveIntoDB, "result": false, status: false, statusCode: 400, "message": "Something went wrong!!", error: "" }
            if (updateisActiveIntoDB.modifiedCount === 1)
                return { data: updateisActiveIntoDB, "result": true, status: true, statusCode: 200, "message": "Student verified successfully!!", error: "" }
        } else {
            return { "result": false, status: false, statusCode: 400, "message": "Something went wrong!!", error: "" }
        }
    } else throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
}

async function createnewuser(firstName, lastName, email, userType, password, universityName) {
    const userCollections = await usersObj();
    function ValidateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        return (false)
    }
    if (!email || ValidateEmail(email) == false) throw { "result": false, statusCode: 400, "message": "", error: "Please provide valid email address." }
    if (!password) throw { "result": false, statusCode: 400, "message": "", error: "Please enter password." }
    if (!firstName || typeof firstName != 'string') throw { "result": false, statusCode: 400, "message": "", error: "Provide a first name or provided first name is not string." }
    if (!lastName || typeof lastName != 'string') throw { "result": false, statusCode: 400, "message": "", error: "Provide a last name or provided last name is not string" }
    if (!universityName || typeof universityName != 'string') throw { "result": false, statusCode: 400, "message": "", error: "Provide a universityName or provided universityName is not string." }
    if (!userType || typeof userType != 'string') throw { "result": false, statusCode: 400, "message": "", error: "Provide a usertype or provided usertype is not string." }
    let isActive = false;
    if (userType.toLowerCase() == "professor") {
        isActive = true;
    }
    else if (userType.toLowerCase() == "student") {
        isActive = false;
    }
    email = email.toLowerCase()
    if (ValidateEmail(email) == true) {
        const userCollections = await usersObj();
        const verifyUserEmail = await userCollections.find({ email: email }).toArray();
        if (verifyUserEmail.length > 0) throw { "result": false, statusCode: 400, "message": "", error: "Email address is already in use." }
    }
    password = await creatingpswd.hashing(password);
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userType: userType,
        password: password,
        universityName: universityName,
        isActive: isActive,
        dateCreated: await utilsObj.dateCreationOnly("startDate")
    }
    const insertInfo = await userCollections.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw { "result": false, statusCode: 500, "message": "", error: "Something went wrong." };
    const newId = insertInfo.insertedId;
    const user = await this.getuserbyid(newId.toString());
    return { data: user, "result": true, statusCode: 200, "message": "", error: "" }
}

async function getuserbyid(id) {
    if (!id) throw "You must provide an id to search for";
    if (typeof id != 'string') throw 'Id is not a String.';

    const userCollections = await usersObj();
    const result = await userCollections.findOne({ _id: mongocall.ObjectID(id) });
    if (result === null) throw `No users with that id : ${id}`;
    result._id = result._id.toString();

    return result;
}

const enrollNow = async function enrollNow(session, professorID, categoryName) {
    let localUsersObj = await usersObj();

    if (session.userID) {
        let getStudentAllTags = await fetchStudentData(session.userID);
        if (session.userType === "student") {
            if (getStudentAllTags.enrolledIn) {
                let studentCategoryCount = getStudentAllTags.enrolledIn.filter(value => {
                    if ((value.professorID.toString() === professorID && value.categoryName === categoryName)) {
                        return true
                    } else {
                        return false
                    }
                });
                if (studentCategoryCount.length > 0) {
                    return { status: false, statusCode: 404, message: `You've been already added into the category.` }
                }
            }
            var updateEnrolledInForStudentIntoDB = await localUsersObj.updateOne({ _id: objOfObjectID(session.userID) }, {
                $push: { enrolledIn: { professorID: objOfObjectID(professorID), categoryName: categoryName } }
            });
        }
    }
    var categoryName = `enrolledStudents.${categoryName}`;

    if (professorID) {
        let getProfessorAllTags = await fetchStudentData(professorID);
        if (getProfessorAllTags.userType === "professor") {
            if (!getProfessorAllTags.enrolledStudents || getProfessorAllTags.enrolledStudents) {
                try {
                    const updateEnrolledStudentsForProfessorIntoDB = await localUsersObj.updateOne({ _id: objOfObjectID(professorID) }, { $push: { [categoryName]: objOfObjectID(session.userID) } })
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
    if (updateEnrolledInForStudentIntoDB.modifiedCount === 0)
        return { status: false, statusCode: 404, message: "Something went wrong!!" }
    if (updateEnrolledInForStudentIntoDB.modifiedCount === 1)
        return { status: true, statusCode: 200, message: "You have been added into the category successfully. Professor will approve your enrollment." }
}

const getAllCategoryData = async function getAllCategoryData(session, reqType) {
    const localCategoryObj = await categoryObj();
    let allCategoryData = await localCategoryObj.aggregate([
        {
            "$group": {
                "_id": { "category": '$category', "createdBy": '$createdBy', "universityDomain": '$universityDomain', 'professorName': '$professorName' }
            }
        }
    ]).toArray();

    let universityCategories = []
    allCategoryData.forEach(async (element) => {

        console.log(element._id.category)
        if (element._id.universityDomain) {
            if (element._id.universityDomain === session.universityDomain) {
                universityCategories.push(element._id)
            }
        }
    });

    return universityCategories
}

module.exports = {
    addUserData,
    getStudentRecord,
    getCategoryData,
    getSubCategoryOfCategory,
    getProfessorData,
    getAllStudentUnderProfessorData,
    updateStudentStatus,
    getQuiz,
    createnewuser,
    getuserbyid,
    getAllCategoryData,
    enrollNow
}
