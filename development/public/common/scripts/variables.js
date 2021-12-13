/**
 * WARNING:
 * Before making modifications to this file, make absolutely sure that
 * you've used the functions and their respective flags (if any) properly.
 * These functions work for almost every webpage, so there are more chances
 * you've used something incorrectly.
 *
 * When making modifications, you also need to test out if the modified code
 * works for each and every webpage.
 */

import { RTDB_USER_ROOT, RTDB_MSG_ROOT, } from '/common/scripts/fbinit.js';

/**
 * Holds non-auth info about the user.
 * @type {Object} Stores user info from Firebase Auth.
 */
export let UserData = {};

/**
 * Holds UID.
 * @type {String} Stores UID from Firebase Auth.
 */
export let USER_ID;

/**
 * Database root
 * @type {String} root location of user data in database.
 */
export let USER_ROOT;

/**
 * Database root
 * @type {String} root location of user messages in database.
 */
export let MSG_ROOT;

/**
 * Getter for global variables. Throws undefined error if variable is undefined.
 *
 * This is for scripts that import modules.js.
 * @param {String} variable Variable identifier, valid values are listed below - case sensitive.
 * @param {Any} value New value of variable.
 *
 * Available values of parameter 'variable':
 * @param {Object}  UserData
 * @param {String}  USER_ID
 * @param {String}  USER_ROOT - Returns full path if USER_ID isn't undefined.
 * @param {String}  MSG_ROOT - Returns full path if USER_ID isn't undefined.
 */
export const getVariable = (variable) => {
    let return_val;
    switch (variable) {
        case 'UserData': {
            return_val = (UserData == {} ? undefined : UserData);
            break;
        }
        case 'USER_ID': {
            return_val = USER_ID;
            break;
        }
        case 'USER_ROOT': {
            return_val = (USER_ID == undefined ? undefined : USER_ROOT);
            break;
        }
        case 'MSG_ROOT': {
            return_val = (USER_ID == undefined ? undefined : MSG_ROOT);
            break;
        }
        default:
            throw `Error: variables.js: getVariable(): no such variable: ${variable}\nNOTE: variable names are case-sensitive`;
    }
    if (return_val == undefined) {
        throw `Error: variables.js: getVariable(): undefined variable: ${variable}`;
    }
    return return_val;
}

/**
 * Setter for global variables.
 *
 * This is for scripts that import modules.js.
 * @param {String} variable Variable identifier, valid values are listed below - case sensitive.
 * @param {Any} value New value of variable.
 *
 * Available values of parameter 'variable':
 * @param {Object}  UserData
 * @param {String}  USER_ID
 * @param {String}  USER_ROOT - ONLY pass in the user id, DON'T pass in database root.
 * @param {String}  MSG_ROOT - ONLY pass in the user id, DON'T pass in database root.
 */
export const setVariable = (variable, value) => {
    switch (variable) {
        case 'UserData': {
            UserData = value;
            break;
        }
        case 'USER_ID': {
            USER_ID = value;
            break;
        }
        case 'USER_ROOT': {
            USER_ROOT = `${RTDB_USER_ROOT}/${value}`;
            break;
        }
        case 'MSG_ROOT': {
            MSG_ROOT = `${RTDB_MSG_ROOT}/${value}`;
            break;
        }
        default:
            throw `Error: variables.js: setVariable(): no such variable: ${variable}\nNOTE: variable names are case-sensitive`;
    }
}

console.log('module variables.js loaded');
