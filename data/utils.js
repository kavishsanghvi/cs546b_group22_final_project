const ObjectId = require('mongodb').ObjectID;

const dateCreation = async function dateCreation() {
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return month + "/" + date + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
}


const variableSanityCheck = async (value, type, elementName, minLength, maxLength) => {
    if (type) {
        switch (type) {
            case "string":
                if (!value) return { result: false, value: false, message: elementName + " should be passed!" };
                if (typeof value !== "string") return { result: false, value: false, message: elementName + " should be string!" };
                if (value.trim() == "") return { result: false, value: false, message: elementName + " should not be blank!" };
                if ((minLength && value.trim().length < minLength) || (maxLength && value.trim().length > maxLength)) return { result: false, value: false, message: elementName + " should be under " + minLength + ' - ' + maxLength + " characters."};
                else return { result: true, value: value.trim(), message: "" }
                break;
            case "ObjectID":
                if (!value) return { result: false, value: false, message: elementName + " should be passed!" };
                if ((ObjectId.isValid(value)) == false) { return { result: false, value: false, message: elementName + ' Should be valid!' }; }
                else return { result: true, value: value, message: "" }
                break;
            case "number":
                if (!value) return { result: false, value: false, message: elementName + " should be passed!" };
                if (typeof value !== "number") return { result: false, value: false, message: elementName + " should be number!" };
                if ((minLength && value < minLength) || (maxLength && value > maxLength)) return { result: false, value: false, message: elementName + " should be under " + minLength + ' - ' + maxLength };
                else return { result: true, value: value, message: "" };
                break;
            case "object":
                if (!value) return { result: false, value: false, message: elementName + " should be passed!" };
                if (typeof value !== "object") return { result: false, value: false, message: elementName + ' Should be valid object!' };
                else return { result: true, value: value, message: "" };
                break;
            case "array":
                if (!value) return { result: false, value: false, message: elementName + " should be passed!" };
                if (!Array.isArray(value)) return { result: false, value: false, message: elementName + " should be array!" };
                if (value.length === 0) return { result: false, value: false, message: elementName + " should not be blank!" };
                let data = value.filter(el => (!el || typeof el !== "string" || (el.trim()).length == 0));
                if (data.length > 0) {
                    return { result: false, value: false, message: elementName + " accept only valid string, it should not be blank!" };
                } else return { result: true, value: value, message: "" };
                break;
            case "date":
                if (!value) return { result: false, value: false, message: elementName + " should be passed!" };
                if (validateDate(value) < 1) {
                    return { result: false, value: false, message: elementName + " accept only valid date format!" };
                } else return { result: true, value: value, message: "" };
                break;
            default:
                return { result: false, value: "", message: "Something went wrong!" };
        }
    } else {
        return { result: false, value: "", message: "Something went wrong!" };
    }
}

const dateCreationOnly = async function dateCreationOnly(dateType) {
    let date_ob = new Date();
    if (dateType === "startDate") {
        var date = ("0" + date_ob.getDate()).slice(-2);
    } else if (dateType === "endDate") {
        var date = ("0" + (date_ob.getDate()- 1) + "").slice(-2);
    }
    
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    return month + "/" + date + "/" + year;
}

module.exports = {
    dateCreation,
    variableSanityCheck,
    dateCreationOnly
}