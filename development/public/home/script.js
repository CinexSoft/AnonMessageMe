import { Auth, Database, } from '/common/scripts/fbinit.js';
import {
    getVariable,
    setVariable,
} from '/common/scripts/variables.js';
import * as CommonJS from '/common/scripts/init.js';

import * as FirebaseAuth from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import * as FirebaseDB from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

let UserMessages = {};

const FirstNamePh = document.getElementById('ph-font-your-name');
const LinkAnchor = document.getElementById('ph-a-your-link');
const ShareButton = document.getElementById('btn-share-link');
const MessagesDiv = document.getElementById('ph-div-your-messages');
const SplashScreen = document.getElementById('SplashScreen-main');

const loadMessagesToUI = function() {
    MessagesDiv.innerHTML = '';
    for (timestamp in getVariable('UserData')) {
        MessagesDiv.innerHTML = (
              `<div class="message placeholder" id="ph-div-msg-${timestamp}">`
            +     HtmlSanitizer.SanitizeHtml(UserMessages.timestamp.message)
            +     '<font class="noselect timestamp">'
            +         UserMessages.timestamp.time
            +     '</font>'
            + '</div>'
        ) + MessagesDiv.innerHTML;
    }
}

const main = function() {
    if (!localStorage.getItem('Auth.UID')
    &&  !location.href.includes('/register')) {
        location.href = '/register';
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

    FirebaseAuth.onAuthStateChanged(Auth, (user) => {
        if (!user) {
            console.error('home: user not signed in');
            localStorage.removeItem('Auth.UID');
            // open login page if not already on login page
            if (!location.href.includes('/register')) location.href = '/register';
            return;
        }

        localStorage.setItem('Auth.UID', user.uid);
        setVariable('USER_ID', user.uid);
        setVariable('USER_ROOT', user.uid);
        setVariable('MSG_ROOT', user.uid);

        FirebaseDB.get(FirebaseDB.ref(Database, getVariable('USER_ROOT')), (snapshot) => {
            const data = snapshot.val();
            setVariable('UserData', data);
            FirstNamePh.innerHTML = getVariable('UserData').name.firstname;
            LinkAnchor.href = `https://sendsecretmsg.web.app/msg?id=${getVariable('USER_ID')}`;
        }, (error) => {
            alert('An error occurred. For details, see console.');
            console.error('home: ' + error);
        });

        // load all user messages from DB
        FirebaseDB.get(FirebaseDB.ref(Database, getVariable('MSG_ROOT')), (snapshot) => {
            const data = snapshot.val();
            UserMessages = data;
            // loads user messages into UI
            loadMessagesToUI();
            SplashScreen.style.visibility = 'hidden';
        }, (error) => {
            alert('An error occurred. For details, see console.');
            console.error('home: ' + error.stack);
        });
    });

    ShareButton.onclick = async () => {
        // Show share sheet
        try {
            await navigator.share({
                title: 'Send a secret message',
                text: `Send a message to ${getVariable('UserData').name.fullname} anonymously!`,
                url: LinkAnchor.href,
            });
        } catch (error) {
            alert('An error occurred. For details, see console.');
            console.error(error.stack);
        }
    }
}

main();

console.log('site /home loaded');
