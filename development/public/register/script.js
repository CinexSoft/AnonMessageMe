import { Auth, Database, FirebaseAuth, FirebaseDB, } from '/common/scripts/fbinit.js';
import { setVariable, getVariable, } from '/common/scripts/variables.js';
import * as CommonJS from '/common/scripts/common.js';

// DOM nodes to interact with JS.
const NameInput = document.getElementById('ph-input-name');
const MessageTxt = document.getElementById('ph-txt-msg');
const SubmitBtn = document.getElementById('btn-submit');
const SplashScreen = document.getElementById('SplashScreen-main');

const getButtonLoadAnim = function() {
    return (
        '<div style="'
      +     'margin: 0;'
      +     'width: 0px;'
      +     'height: 0px;'
      +     'border: 2px solid var(--prim-bgcolor);'
      +     'border-top: 2px solid transparent;'
      +     'border-radius: 50%;'
      +     'background-color: transparent;'
      +     'animation: loadspin 1s linear infinite; ">'
      + '</div>'
    );
}

const main = function() {

    // if UID is present in local storage, load /home
    if (localStorage.getItem('Auth.UID')
    &&  !location.href.includes('/home')) {
        location.href = '/home';
        return;
    }

    // on submit button click
    SubmitBtn.onclick = () => {

        const fullname = NameInput.value;
        const message = MessageTxt.value;

        // empty name isn't acceptable
        if (!fullname) {
            alert("Name can't be empty.");
            return;
        }

        // empty message isn't acceptable
        if (!message) {
            alert("Message can't be empty.");
            return;
        }

        // start a loading animation in the button
        SubmitBtn.innerHTML = getButtonLoadAnim();

        // sign use in anonymously
        FirebaseAuth.signInAnonymously(Auth).then(() => {
            // nada
        }).catch((error) => {
            alert('Sign In failed: ' + error);
            console.error(error);
        });

        // after sign in, this listener will execute
        FirebaseAuth.onAuthStateChanged(Auth, (user) => {

            // if not signed in / signed out, return
            if (!user) {
                console.error('register: user not signed in');
                localStorage.removeItem('Auth.UID');
                return;
            }

            // store UID in local storage
            localStorage.setItem('Auth.UID', user.uid);

            // set global variables
            setVariable('USER_ID', user.uid);
            setVariable('USER_ROOT', user.uid);
            setVariable('MSG_ROOT', user.uid);

            // upload user data from filled form to database
            FirebaseDB.update(FirebaseDB.ref(Database, getVariable('USER_ROOT')), {
                uid: getVariable('USER_ID'),
                name: {
                    firstname: CommonJS.encode((fullname + ' ').substring(0, fullname.indexOf(' '))),
                    fullname: CommonJS.encode(fullname),
                },
                message: CommonJS.encode(message),
            }).then(() => {
                // on update finish, load /home page
                location.href = '/home';
                console.log('register: uploaded data');
            }).catch((error) => {
                alert('An error occurred.');
                console.error(error);
            });
        });
    }

    // hide splashscreen once everything is loaded
    SplashScreen.style.visibility = 'hidden';
}

main();

console.log('site /register loaded');
