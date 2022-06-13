
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const output = (label, value) => {
    if (value === undefined) {
        console.log(`${label}`);
    } else {
        if (value !== Object(value)) {
            console.log(`${label}: `, value);
        } else {
            if (Object.prototype.toString.call(value).slice(8, -1) === "Map") {
                console.log(`${label}: `, value);
            } else {
                console.log(`${label}: `, JSON.parse(JSON.stringify(value)));
            }
        }
    }
};

const showToast = (title, message, variant = "info", mode = "dismissable") => {
    const event = new ShowToastEvent({
        title,
        message,
        variant,
        mode,
    });
    dispatchEvent(event);
};

const throwToastError = (error) => {
    if (error) {
        if ("body" in error) {
            output("Server Error", error.body.message);
            showToast(error.body.exceptionType, error.body.message, "error");
        } else {
            output("Local Error", error.message);
            showToast("Error", error.message, "error");
        }
    }
};

const raiseCustomEvent = (component, eventName, detail) => {
    if (!detail) {
        detail = {};
    }
    const event = new CustomEvent(eventName, {
        detail,
    });
    component.dispatchEvent(event);
};

/**
 * Reduces one or more LDS errors into a string[] of error messages.
 * @param {FetchResponse|FetchResponse[]} errors
 * @return {String[]} Error messages
 */
const reduceErrors = (errors) => {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }

    return (
        errors
            // Remove null/undefined items
            .filter((error) => !!error)
            // Extract an error message
            .map((error) => {
                // UI API read errors
                if (Array.isArray(error.body)) {
                    return error.body.map((e) => e.message);
                }
                // Page level errors
                else if (error?.body?.pageErrors && error.body.pageErrors.length > 0) {
                    return error.body.pageErrors.map((e) => e.message);
                }
                // Field level errors
                else if (error?.body?.fieldErrors && Object.keys(error.body.fieldErrors).length > 0) {
                    const fieldErrors = [];
                    Object.values(error.body.fieldErrors).forEach((errorArray) => {
                        fieldErrors.push(...errorArray.map((e) => e.message));
                    });
                    return fieldErrors;
                }
                // UI API DML page level errors
                else if (error?.body?.output?.errors && error.body.output.errors.length > 0) {
                    return error.body.output.errors.map((e) => e.message);
                }
                // UI API DML field level errors
                else if (error?.body?.output?.fieldErrors && Object.keys(error.body.output.fieldErrors).length > 0) {
                    const fieldErrors = [];
                    Object.values(error.body.output.fieldErrors).forEach((errorArray) => {
                        fieldErrors.push(...errorArray.map((e) => e.message));
                    });
                    return fieldErrors;
                }
                // UI API DML, Apex and network errors
                else if (error.body && typeof error.body.message === "string") {
                    return error.body.message;
                }
                // JS errors
                else if (typeof error.message === "string") {
                    return error.message;
                }
                // Unknown error shape so try HTTP status text
                return error.statusText;
            })
            // Flatten
            .reduce((prev, curr) => prev.concat(curr), [])
            // Remove empty strings
            .filter((message) => !!message)
    );
};

const sortOptionsByLabel = (optionList) => {
    optionList.sort((a, b) => {
        if (a.label > b.label) {
            return 1;
        } else if (b.label > a.label) {
            return -1;
        } else {
            return 0;
        }
    });
};

const getMapFromObjectArray = (arr) => {
    return arr.reduce((map, obj) => {
        map[obj.key] = obj.val;
        return map;
    }, {});
};

const deepCopy = (obj) => {
    let rv;
    if (typeof obj === "object") {
        if (obj === null) {
            // null => null
            rv = null;
        } else {
            switch (Object.prototype.toString.call(obj)) {
                case "[object Array]":
                    // It's an array, create a new array with
                    // deep copies of the entries
                    rv = obj.map(deepCopy);
                    break;
                case "[object Date]":
                    // Clone the date
                    rv = new Date(obj);
                    break;
                case "[object RegExp]":
                    // Clone the RegExp
                    rv = new RegExp(obj);
                    break;
                // ...probably a few others
                default:
                    // Some other kind of object, deep-copy its
                    // properties into a new object
                    rv = Object.keys(obj).reduce((prev, key) => {
                        prev[key] = deepCopy(obj[key]);
                        return prev;
                    }, {});
                    break;
            }
        }
    } else {
        // It's a primitive, copy via assignment
        rv = obj;
    }
    return rv;
};

export { output, showToast, throwToastError, raiseCustomEvent, reduceErrors, sortOptionsByLabel, getMapFromObjectArray, deepCopy };