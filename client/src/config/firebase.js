import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA9gLyqwpCUiAHfkF6Jj-9KLgL8KfI-i1o',
  authDomain: 'react-student-management.firebaseapp.com',
  projectId: 'react-student-management',
  storageBucket: 'react-student-management.appspot.com',
  messagingSenderId: '293832139595',
  appId: '1:293832139595:web:6f2cf77ce1ad2574247ece'
};

firebase.initializeApp(firebaseConfig);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`),
    studentRef = firestore.doc(`students/${userAuth.uid}`);

  const userSnapshot = await userRef.get(),
    studentSnapshot = await studentRef.get();

  if (studentSnapshot.exists) {
    try {
      return studentRef
        .update({
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => studentRef);
    } catch (err) {
      console.log(err);
    }
  } else if (!userSnapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    return userRef;
  }
};

export const checkIfAuthenticated = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`),
    studentRef = firestore.doc(`students/${userAuth.uid}`);

  const userSnapshot = await userRef.get(),
    studentSnapshot = await studentRef.get();

  return studentSnapshot.exists
    ? studentRef
    : userSnapshot.exists
    ? userRef
    : null;
};

export const getClassRef = async courseCode => {
  const classesRef = firestore
    .collection('classes')
    .where('courseCode', '==', courseCode);
  const snapshot = await classesRef.get();

  if (!snapshot.empty) return snapshot.docs[0].ref;
};

export const getCurrentUser = () =>
  new Promise((reseolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe();
      reseolve(userAuth);
    }, reject);
  });

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
