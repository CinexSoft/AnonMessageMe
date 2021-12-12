import { Auth, } from '/common/scripts/fbinit.js';
import { setVariable, USER_ROOT } from '/common/scripts/variables.js';

import * as FirebaseAuth from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import * as FirebaseDB from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

const init = function() {
    FirebaseAuth.onAuthStateChanged(Auth, (user) => {
        if (!user) {
            console.error('init.js: user not signed in');
            localStorage.removeItem('Auth.UID');
            // open login page if not already on login page
            if (!location.href.includes('/register')) location.href = '/register';
            return;
        }
        localStorage.setItem('Auth.UID', user.uid);
        setVariable('USER_ID', user.uid);
        setVariable('USER_ROOT', user.uid);
        setVariable('MSG_ROOT', user.uid);
        FirebaseDB.get(FirebaseDB.ref(Database, USER_ROOT), (snapshot) => {
            const data = snapshot.val();
            setVariable('UserData', data);
        }, (error) => {
            alert('An error occurred. For details, see console.');
            console.error('init.js: ' + error.stack);
        });
    });
}

init();

console.log('module init.js loaded');
