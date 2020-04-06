import firebase from 'firebase';

const config = { 
    apiKey: "AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU",
    authDomain: "plagiarism-checker-7be67.firebaseapp.com",
    databaseURL: "https://plagiarism-checker-7be67.firebaseio.com",
    projectId: "plagiarism-checker-7be67",
    storageBucket: "plagiarism-checker-7be67.appspot.com",
    messagingSenderId: "417324373519",
    appId: "1:417324373519:web:256a9c3806a2246aa2f57a"
};
const fire = firebase.initializeApp(config);
export default fire;