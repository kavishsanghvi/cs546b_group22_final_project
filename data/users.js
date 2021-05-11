const mongoCollections = require('../config/mongoCollections');
const quizObj = mongoCollections.quiz;
const usersObj = mongoCollections.users;
const categoryObj = mongoCollections.categories;
const objOfObjectID = require('mongodb').ObjectID;
const creatingpswd = require('./bcrypt');
const mongocall = require("mongodb");
// const getStudentData = async function getStudentData() {
//     const localUsersObj = await usersObj();
//     const getAllUsersData = await localUsersObj.find({}).toArray();
//     if (getAllUsersData.length === 0)
//         return []
//     if (getAllUsersData.length > 0)
//         return JSON.parse(JSON.stringify(getAllUsersData));
// }

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
    const getProfessorDetails = await localUsersObj.findOne({ $and: [{ _id: objOfObjectID(session.userID), userType: "professor" }] });
    // if (getProfessorDetails.length === 0)
    //     return []
    // if (getProfessorDetails.length > 0)
    // return JSON.parse(JSON.stringify(getProfessorDetails));

    return getProfessorDetails;
}

const getStudentRecord = async function getStudentRecord(session, studentUserIDs) {
    const localUsersObj = await usersObj();
    // console.log("Inside User Data")
    // console.log(studentUserIDs.length)
    const getStudentRecord = []
    //Working Line
    // const getStudentRecord = await localUsersObj.findOne({ _id: objOfObjectID(studentUserID) });
    // Working above

    for (let i = 0; i < studentUserIDs.length; i++) {
        // const a = studentUserIDs[i]
        // const b = await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) })

        // console.log(studentUserIDs[i].concat(await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) })))
        getStudentRecord.push(Object.assign(studentUserIDs[i], await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) })));
        // getStudentRecord.push(await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) }));
        // console.log(employee)
    }


    // const getProfessorDetails = await localUsersObj.findOne({ userid: "606a4b854e01be2ba0a16ea0" });

    // if (getProfessorDetails.length === 0)
    //     return []
    // if (getProfessorDetails.length > 0)
    // return JSON.parse(JSON.stringify(getStudentRecord));
    return getStudentRecord;
}

const getCategoryData = async function getCategoryData(session, reqType) {
    const localCategoryObj = await categoryObj();
    console.log(objOfObjectID(session.userID))
    // const getAllCategoryData = await localCategoryObj.find({}).toArray();
    let getProfessorCategories = await localCategoryObj.distinct(reqType, { createdBy: objOfObjectID(session.userID) })
    // console.log(a)
    return getProfessorCategories
}

const getSubCategoryOfCategory = async function getSubCategoryOfCategory(session, mainCategory, subCategory) {
    const localCategoryObj = await categoryObj();
    // const getAllCategoryData = await localCategoryObj.find({}).toArray();
    let getProfessorCategories = await localCategoryObj.distinct(subCategory, { createdBy: objOfObjectID(session.userID), category: mainCategory })
    // console.log(a)
    return getProfessorCategories
}

const getAllStudentUnderProfessorData = async function getAllStudentUnderProfessorData(session) {
    // let localUsersObj = await usersObj();
    let returnDataFromProfessor = await getProfessorData(session);
    const getStudentsUnderProfessorRecord = []
    for (let i = 0; i < Object.keys(returnDataFromProfessor.enrolledStudents).length; i++) {
        let keyName = Object.keys(returnDataFromProfessor.enrolledStudents)[i];
        for (let j = 0; j < returnDataFromProfessor.enrolledStudents[keyName].length; j++) {
            getStudentsUnderProfessorRecord.push(returnDataFromProfessor.enrolledStudents[keyName][j])
        }
        // console.log(returnDataFromProfessor.enrolledStudents[i]);
    }
    let returnStudentData = await getOneStudentRecord(session, getStudentsUnderProfessorRecord);
    // const getAllCategoryData = await localCategoryObj.find({}).toArray();
    // let getInActiveUserData = await localUsersObj.find({isActive: false}).toArray();
    // console.log(a)
    return returnStudentData
}

const getOneStudentRecord = async function getOneStudentRecord(session, studentUserIDs) {
    let localUsersObj = await usersObj();
    const getStudentRecord = []
    for (let i = 0; i < studentUserIDs.length; i++)
        getStudentRecord.push(await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i]) }));
    return getStudentRecord;
}

// const getIsActiveFalseUserData = async function getIsActiveFalseUserData() {
// let localUsersObj = await usersObj();
// let returnDataFromProfessor = await getProfessorData();
// const getStudentsUnderProfessorRecord = []
// for(let i = 0; i<Object.keys(returnDataFromProfessor.enrolledStudents).length; i++){
//     let keyName = Object.keys(returnDataFromProfessor.enrolledStudents)[i];
//     for(let j = 0; j<returnDataFromProfessor.enrolledStudents[keyName].length; j++){
//         getStudentsUnderProfessorRecord.push(returnDataFromProfessor.enrolledStudents[keyName][j])
//     }
//     // console.log(returnDataFromProfessor.enrolledStudents[i]);
// }

// // const getAllCategoryData = await localCategoryObj.find({}).toArray();
// // let getInActiveUserData = await localUsersObj.find({isActive: false}).toArray();
// // console.log(a)
// return getStudentsUnderProfessorRecord
// }

const fetchStudentData = async function fetchStudentData(id) {
    let localUsersObj = await usersObj();
    return await localUsersObj.findOne({ _id: objOfObjectID(id) })
}

const updateStudentStatus = async function updateStudentStatus(session, id) {
    if (session.userType === "professor") {
        let getStudentData = await fetchStudentData(id);
        let result = { status: false, message: "" }
        // if (Object.keys(getStudentData).length > 0) {
        if (getStudentData.isActive == false) {
            let localUsersObj = await usersObj();
            const updateisActiveIntoDB = await localUsersObj.updateOne({ _id: objOfObjectID(id) }, { $set: { "isActive": true } });
            if (updateisActiveIntoDB.modifiedCount === 0)
                return { status: false, message: "Not Verified!!" }
            if (updateisActiveIntoDB.modifiedCount === 1)
                return { status: true, message: "Verified Successfully!!" }
        } else {
            return { status: false, message: "Not Verified!!" }
        }
    } else throw `You're not authorized to perform this operation.`
}

async function createnewuser(firstName, lastName, email, userType, password, universityName) {
    const userCollections = await usersObj();
    function ValidateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        return (false)
    }
    if (!email || ValidateEmail(email) == false) throw "Please provide an email address or provided email address is not valid";
    if (!password) throw "Provide a password";
    if (!firstName || typeof firstName != 'string') throw "Provide a first name or provided first name is not string";
    if (!lastName || typeof lastName != 'string') throw "Provide a last name or provided last name is not string";
    if (!universityName || typeof universityName != 'string') throw "Provide a universityName or provided universityName is not string";
    if (!userType || typeof userType != 'string') throw "Provide a usertype or provided usertype is not string";
    let isActive = false;
    if (userType.toLowerCase() == "professor") {
        isActive = true;
    }
    else if (userType.toLowerCase() == "student") {
        isActive = false;
    }
    // function isvalidDate(d){
    //     return !isNaN((new Date(d)).getTime())                                                  //reference stackoverflow
    //   }
    //   if (!isvalidDate(dateCreated)) throw 'Not a proper date';

    password = await creatingpswd.hashing(password);


    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userType: userType,
        password: password,
        universityName: universityName,
        isActive: isActive,
        dateCreated: "05/09/2021"
    }
    const insertInfo = await userCollections.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add user';

    const newId = insertInfo.insertedId;

    const user = await this.getuserbyid(newId.toString());
    return user;

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
    console.log(session.userID)
    console.log(professorID)
    console.log(categoryName)

    let getStudentAllTags = await fetchStudentData(session.userID);

    if (session.userID) {
        let getStudentAllTags = await fetchStudentData(session.userID);
        if (!getStudentAllTags.enrolledIn || getStudentAllTags.enrolledIn) {
            let studentCategoryCount = getStudentAllTags.enrolledIn.filter(value => 
                {
                    if((value.professorID.toString() ===  professorID && value.categoryName === categoryName)){
                        return true
                    }else{
                        return false
                    }
                });
                if(studentCategoryCount.length > 0){
                    return `You've been already added into the category.`
                }
            // console.log(abc)


            // getStudentAllTags.enrolledIn.forEach( element => {
            //     console.log(element.professorID)
            //     console.log(element.categoryName)
            //     if(element.professorID.toString() ===  professorID && element.categoryName === categoryName){
            //         return `You've been already added into the category.`
            //     }
            // });
            const updateEnrolledInForStudentIntoDB = await localUsersObj.updateOne({ _id: objOfObjectID(session.userID) }, {
                $push: { enrolledIn: { professorID: objOfObjectID(professorID), categoryName: categoryName } }
            });
        }
    }
    var categoryName = `enrollStudetns.${categoryName}`;
    // const tt = `enrollStudetns.${categoryName}`;
    if (professorID) {
        let getProfessorAllTags = await fetchStudentData(professorID);
        if (getProfessorAllTags.userType === "professor") {
            if (!getProfessorAllTags.enrolledStudents || getProfessorAllTags.enrolledStudents) {
                try {
                    const updateEnrolledStudentsForProfessorIntoDB = await localUsersObj.updateOne({ _id: objOfObjectID(professorID) }, { $push: { [categoryName]: objOfObjectID(session.userID) } })

                    // console.log(updateEnrolledStudentsForProfessorIntoDB)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
    // return await localUsersObj.findOne({ professorID: objOfObjectID(professorID), categoryName: categoryName })
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
    // getStudentData,
    addUserData,
    getStudentRecord,
    getCategoryData,
    getSubCategoryOfCategory,
    // getIsActiveFalseUserData,
    getProfessorData,
    getAllStudentUnderProfessorData,
    updateStudentStatus,
    getQuiz,
    createnewuser,
    getuserbyid,
    getAllCategoryData,
    enrollNow
}
