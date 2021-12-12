import { Auth, Database, } from '/common/scripts/fbinit.js';
import {
    setVariable,
    getVariable,
} from '/common/scripts/variables.js';
import * as CommonJS from '/common/scripts/init.js';

import * as FirebaseAuth from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import * as FirebaseDB from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

const NameInput = document.getElementById('ph-input-name');
const MessageTxt = document.getElementById('ph-txt-msg');
const SubmitBtn = document.getElementById('btn-submit');
const SplashScreen = document.getElementById('SplashScreen-main');

const main = function() {
    if (localStorage.getItem('Auth.UID')
    &&  !location.href.includes('/home')) {
        location.href = '/home';
        return;
    }

    // html sanitizer configuration - additional tags and attributes
    HtmlSanitizer.AllowedTags['h'] = true;
    HtmlSanitizer.AllowedAttributes['alt'] = true;
    HtmlSanitizer.AllowedAttributes['id'] = true;
    HtmlSanitizer.AllowedAttributes['class'] = true;
    HtmlSanitizer.AllowedAttributes['download'] = true;
    HtmlSanitizer.AllowedSchemas.push('mailto:');
    HtmlSanitizer.AllowedCssStyles['width'] = true;
    HtmlSanitizer.AllowedCssStyles['height'] = true;
    HtmlSanitizer.AllowedCssStyles['min-width'] = true;
    HtmlSanitizer.AllowedCssStyles['min-height'] = true;
    HtmlSanitizer.AllowedCssStyles['max-width'] = true;
    HtmlSanitizer.AllowedCssStyles['max-height'] = true;
    HtmlSanitizer.AllowedCssStyles['padding'] = true;
    HtmlSanitizer.AllowedCssStyles['margin'] = true;
    HtmlSanitizer.AllowedCssStyles['border'] = true;
    HtmlSanitizer.AllowedCssStyles['border-radius'] = true;
    HtmlSanitizer.AllowedCssStyles['display'] = true;
    HtmlSanitizer.AllowedCssStyles['overflow'] = true;
    HtmlSanitizer.AllowedCssStyles['transform'] = true;
    HtmlSanitizer.AllowedCssStyles['background'] = true;

    SubmitBtn.onclick = () => {
        const fullname = NameInput.value.replace(/</g, '&lt;')
                                         .replace(/>/g, '&gt;');
        const message = HtmlSanitizer.SanitizeHtml(MessageTxt.value);
        if (!fullname) {
            alert("Name can't be empty.");
            return;
        }
        if (!message) {
            alert("Message can't be empty.");
            return;
        }
        FirebaseAuth.signInAnonymously(Auth).then(() => {

        }).catch((error) => {
            alert('Registration failed: ' + error);
            console.error('register: ' + error);
        });

        FirebaseAuth.onAuthStateChanged(Auth, (user) => {
            if (!user) {
                console.error('register: user not signed in');
                localStorage.removeItem('Auth.UID');
                return;
            }

            localStorage.setItem('Auth.UID', user.uid);
            setVariable('USER_ID', user.uid);
            setVariable('USER_ROOT', user.uid);
            setVariable('MSG_ROOT', user.uid);

            FirebaseDB.update(FirebaseDB.ref(Database, getVariable('USER_ROOT')), {
                uid: getVariable('USER_ID'),
                name: {
                    firstname: (fullname + ' ').substring(0, fullname.indexOf(' ')),
                    fullname: fullname,
                },
                message: message,
            }).catch((error) => {
                alert('An error occurred. For details, see console.');
                console.error('register: ' + error);
            });
            localStorage.setItem('Auth.UID', user.uid);
            location.href = '/home';
        });
    }
    SplashScreen.style.visibility = 'hidden';
}

main();

console.log('site /register loaded');
