const mongoCollections = require('../config/mongoCollections');
const categories = mongoCollections.categories;
var ObjectId = require('mongodb').ObjectID;
const utilsObj = require('./utils')

const testString = function testString(testStr) {
    try {
        if (testStr == null) throw 'Input cannot be empty!'
        if (typeof testStr != 'string') throw "The input should be a string"
        if (testStr.length <= 1) throw "The length of the input should be greater than 1"
        if (testStr.length == testStr.split(' ').length - 1) throw 'The input string cannot consist of only spaces!'
    } catch (err) {
        var error = "Error: " + err
        return { error: true, message: error }
    }
    return { error: false }
}


const getCatOrSubCatByName = async function getCatOrSubCatByName(name, type) {

    if (testString(name)['error'] == true) throw testString(name)['message']

    const categoryCollection = await categories();
    const query = { $text: { $search: name } };


    // find documents based on our query and projection
    const info = await categoryCollection.find({ [type]: name }).toArray();
    return info

}

const getCategoryByID = async function getCategoryByID(id) {
    if (!id) throw 'You must provide an id to fetch for'
    if (typeof id != 'string') throw 'id is not a valid string'
    try {
        id = ObjectId(id)
    } catch (e) {
        throw 'Invalid Id. Argument passed in must be a single String of 12 bytes or a string of 24 hex characters. ' + 'Error: ' + e
    }
    const categoryCollection = await categories();
    const category = await categoryCollection.findOne({ _id: id });

    if (!category) throw 'Category with id: ' + id + ' was not found';
    return category;
}


const createCategory = async function createCategory(categoryName, subCategoryName, session) {
    let checkcategoryName = await utilsObj.variableSanityCheck(categoryName, "string", "Category Name", 1, 50);
    if (checkcategoryName.result) categoryName = checkcategoryName.value
    else throw `${checkcategoryName.message}`

    let checksubCategoryName = await utilsObj.variableSanityCheck(subCategoryName, "string", "Sub Category", 1, 50);
    if (checksubCategoryName.result) subCategoryName = checksubCategoryName.value
    else throw `${checksubCategoryName.message}`

    categoryName = categoryName.trim().toLowerCase()
    subCategoryName = subCategoryName.trim().toLowerCase()

    try {
        if (session.user == null) throw 'Session Expired'
        if (testString(categoryName)['error'] == true) throw testString(categoryName)['message']

        if (testString(subCategoryName)['error'] == true) throw testString(subCategoryName)['message']


        const category = {
            category: categoryName,
            subCategory: subCategoryName,
            universityDomain: session.user.universityDomain,
            professorName: `${session.user.firstName} ${session.user.lastName}`,
            createdBy: ObjectId(session.user["userID"])
        }

        const categoryList = await getCatOrSubCatByName(categoryName, "category");
        const subCategoryList = await getCatOrSubCatByName(subCategoryName, "subCategory")

        if (categoryList != 0 & subCategoryList != 0) throw `The Sub Category "${subCategoryName}" within Category "${categoryName}" already exists`


        const categoryCollection = await categories();
        const insertInfo = await categoryCollection.insertOne(category);
        if (insertInfo.insertedCount === 0) throw 'Could not add Category';

        const categoryID = insertInfo.insertedId;
        const categoryInfo = await getCategoryByID(categoryID.toString());

        return categoryInfo

    } catch (err) {
        throw 'Error: ' + err
    }

}

const getCategories = async function getCategories(session) {
    if(!session.userID) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
    const categoryCollection = await categories();
    var categoryList = await categoryCollection.distinct('category', { createdBy: ObjectId(session.userID) });
    return categoryList
}

const getSubCategories = async function getSubCategories(session, categoryName) {
    if(!session.userID) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
    let checkcategoryName = await utilsObj.variableSanityCheck(categoryName, "string", "Category");
    if (checkcategoryName.result) categoryName = checkcategoryName.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

    const categoryCollection = await categories();
    var subCategoryData = await categoryCollection.find({createdBy: ObjectId(session.userID), category: { $eq: categoryName } }, { subCategory: 1 }).toArray()
    var subCategoryList = []

    for (i in subCategoryData) {
        subCategoryList.push(subCategoryData[i]['subCategory'])
    }
    return subCategoryList
}

module.exports = {
    getCategoryByID,
    createCategory,
    getCatOrSubCatByName,
    getCategories,
    getSubCategories
}


/*

Categories {
id: '',
category: '',
subCategory: '',
}

*/