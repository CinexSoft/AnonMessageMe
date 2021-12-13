import { Auth, Database, FirebaseAuth, FirebaseDB, } from '/common/scripts/fbinit.js';
import { getVariable, setVariable, } from '/common/scripts/variables.js';
import * as CommonJS from '/common/scripts/common.js';

// DOM elements to interact with JS
const RcpFirstname = document.getElementById('ph-font-recipient-firstname');
const RcpFullname = document.getElementById('ph-font-recipient-fullname');
const H1Banner = document.getElementById('ph-h1-banner');
const RcpMsg = document.getElementById('ph-p-recipients-msg');
const TxtMsg = document.getElementById('ph-textarea-msg');
const BtnSend = document.getElementById('btn-send');
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

const loadPostSentBanner = function(txt = 'Message sent!') {
    H1Banner.innerHTML = txt;
    RcpMsg.innerHTML = 'You can create your own link. Tap the button below to continue.';
    BtnSend.innerHTML = 'Create your link!';
    const newBtn = BtnSend.cloneNode(true);
    BtnSend.parentNode.replaceChild(newBtn, BtnSend);
    TxtMsg.parentNode.removeChild(TxtMsg);
    newBtn.onclick = () => location.href = '/register';
}

const main = function() {

    if (localStorage.getItem('msg.Sent') === 'true') {
        loadPostSentBanner();
        SplashScreen.style.visibility = 'hidden';
        return;
    }

    if (CommonJS.getURLQueryFieldValue('msg') !== 'true') {
        loadPostSentBanner('Create your link!');
        SplashScreen.style.visibility = 'hidden';
        return;
    }

    const UID = CommonJS.getURLQueryFieldValue('id');
    if (Array.isArray(UID)) {
        alert('Invalid link');
        return;
    }

    // variables based on UID
    const pushkey = FirebaseDB.push(FirebaseDB.ref(Database, UID)).key;;
    setVariable('USER_ID', UID);
    setVariable('USER_ROOT', UID);
    setVariable('MSG_ROOT', UID);

    // download recipient data
    FirebaseDB.onValue(FirebaseDB.ref(Database, getVariable('USER_ROOT')), (snapshot) => {

        // loads recipient from database, getVariable blocks nullish values
        setVariable('UserData', snapshot.val());
        const UserData = getVariable('UserData');

        // sanitizes text to deactivate scripts / HTML tags
        RcpFirstname.innerHTML = CommonJS.decode(UserData.name.firstname).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        RcpFullname.innerHTML = CommonJS.decode(UserData.name.fullname).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        if (UserData.message !== 'empty') {
            RcpMsg.innerHTML = HTMLSanitizer.sanitizeHTML(CommonJS.decode(UserData.message));
        }

        // hides splashscreen once everything is loaded
        SplashScreen.style.visibility = 'hidden';
    }, (error) => {
        alert('An error occurred.');
        console.error(error);
    });

    // on send button click
    BtnSend.onclick = () => {

        // empty message isn't acceptable
        if (!TxtMsg.value) {
            alert('Message can\'t be empty');
            return;
        }

        // start button animation
        BtnSend.innerHTML = getButtonLoadAnim();

        // upload message to db
        FirebaseDB.update(FirebaseDB.ref(Database, getVariable('MSG_ROOT') + `/${pushkey}`), {
            message: TxtMsg.value,
            time: CommonJS.getLongDateTime()
        }).then(() => {
            BtnSend.innerHTML = 'Sent!';               // end button animation
            localStorage.setItem('msg.Sent', 'true');  // write flag to mark that this user has sent a message already
            loadPostSentBanner();                      // load banner
        }).catch((error) => {
            BtnSend.innerHTML = 'Sent!';
            alert('An error occurred');
            console.log(error);
        });
    }
}

main();

console.log('site /msg loaded');
