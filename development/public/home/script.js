import { Database, } from '/common/scripts/fbinit.js';
import {
    USER_ID,
    setVariable,
    USER_ROOT,
} from '/common/scripts/variables.js';

import * as FirebaseDB from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

let UserMessages = {};

const FirstNamePh = document.getElementById('ph-font-your-name');
const LinkAnchor = document.getElementById('ph-a-your-link');
const ShareButton = document.getElementById('btn-share-link');
const MessagesDiv = document.getElementById('ph-div-your-messages');

const loadMessagesToUI = function() {
    MessagesDiv.innerHTML = '';
    for (timestamp in UserData) {
        MessagesDiv.innerHTML = (
              `<p class="message placeholder" id="ph-p-msg-${timestamp}">`
            +     HtmlSanitizer.SanitizeHtml(UserMessages.timestamp.message)
            +     '<font class="noselect timestamp">'
            +         UserMessages.timestamp.time
            +     '</font>'
            + '</p>'
        ) + MessagesDiv.innerHTML;
    }
}

const main = function() {
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

    const SplashScreen = document.createElement('div');
    {
        SplashScreen.className = (SplashScreen.className + " vert-layout SplashScreen").trim();
        SplashScreen.style = {
            margin: '0',
            padding: '0',
            position: 'fixed',
            inset: '0',
            width: '100vh',
            height: '100vh',
            color: 'var(--prim-fgcolor)';
            backgroundColor: 'var(--prim-bgcolor)',
            zIndex: '50',
        };
        document.appendElemnt(SplashScreen);
    }

    FirstNamePh.innerHTML = UserData.name.firstname;
    LinkAnchor.href = `https://sendsecretmsg.web.app/msg?id=${UserData.uid}`;
    ShareButton.onclick = async () => {
        // Show share sheet
        const ShareData = {
            title: 'Send a secret message',
            text: `Send a message to ${UserData.name.fullname} anonymously!`,
            url: LinkAnchor.href,
        };
        try {
            await navigator.share(ShareData);
        } catch (error) {
            alert('An error occurred. For details, see the console');
            console.error(error.stack);
        }
    });

    // load all user messages from DB
    FirebaseDB.get(FirebaseDB.ref(Database, USER_ROOT), (snapshot) => {
        const data = snapshot.val();
        UserMessages = data;
        document.removeItem(SplashScreen);
        // loads user messages into UI
        loadMessagesToUI();
    }, (error) => {
        alert('An error occurred. For details, see console.');
        console.error('init.js: ' + error.stack);
    });
}

main();

log('site /home loaded');
