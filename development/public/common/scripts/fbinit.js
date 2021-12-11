import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

// firebase init
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FirebaseConfig = {
    apiKey: "AIzaSyAEt2zhzIqDsEp-SPLteD9aCl9WQkoYizY",
    authDomain: "sendsecretmsg.firebaseapp.com",
    databaseURL: "https://sendsecretmsg-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sendsecretmsg",
    storageBucket: "sendsecretmsg.appspot.com",
    messagingSenderId: "75632318136",
    appId: "1:75632318136:web:4645e18ba4d3ce2418464d"
};

// If hosted on localhost, use database at localhost
if (/localhost|127\.0.\.0\.1/i.test(location.href)) FirebaseConfig.databaseURL = 'http://localhost:9000/?ns=sendsecretmsg';

// Initialize Firebase
export const App = initializeApp(FirebaseConfig);
export const Database = getDatabase(App);
export const Auth = getAuth(App);

/* Seperates roots for preview and production databases.
 * This code checks if the URL is the production URL and accordingly sets the
 * database root.
 * Production URLs are sendsecretmsg.web.app and sendsecretmsg.firebaseapp.com
 */
const ROOT = (!/sendsecretmsg\.web\.app|sendsecretmsg\.firebaseapp\.com/i.test(location.href) ? '/preview' : '/production');

export const RTDB_USERS_ROOT = ROOT + '/aa14fdd9-users';
export const RTDB_SLOGS_ROOT = ROOT + '/b6d6cc89-slogs';
export const RTDB_CHATS_ROOT = ROOT + '/ce471190-chats';

console.log('module firebaseinit.js loaded');
