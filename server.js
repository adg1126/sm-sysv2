const express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  path = require('path'),
  compression = require('compression'),
  enforce = require('express-sslify'),
  admin = require('firebase-admin'),
  firebase = require('firebase');
require('firebase/firestore');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'react-student-management',
    private_key_id: 'f956550530a633e9a18b20c98ab0319ccec79d2b',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDAJeVtXXfYgnqb\nUfUT0GnYbNIJYJ2sWEGk+oxbKnd1JQN/HRHisELAm7h08TcbXl/c4FZKTxAhgo66\nGjkMgjS0iySrXU69mTIylxFUxwQK5EQ/3c3D7leaSUuRfLsPC9U5iHlXmL7T/a/h\nudr6IkADUEZnTBWayFkCxY6kqnHGJsQcbnfYSes2oth3nMEfDk7wp5j7DVF4Vi40\nwh7Po0NvAL3yoyukvjdMULgiNns3R3nbo6YKGS0dW0PVjx0GfXrNIoNnAwMnIIut\n3euiiUVAQbAOj4wqM9K0wqRRwYsX2mS++x16H2/ztkZmfunMNJ7rzuw4M2k/0HNv\nygW4IrzJAgMBAAECggEALhiZTO6cqvgIZl0XzJhV4CohDEddpCQrIWNLCy7pqBSI\nXXURnp628OKaspFQrVPrbv9xrBOCFOvvhiV21LGi58Iuup6gnnsTUBAuQ/aXmW5Q\nEjtJmwzBft3BD4bLEG3ACjSbmaBm/U/xoxcVeacAUNsv/KWD1FVmhzPyR74tG8I0\nINjUT3gYdV5SiC3f7eBfZDdLlsdKcz3eX/VKAAeUG93AUd952lHDOwweDB1BJrqR\nhK5YJrYzdo0ONuGwmimFAjnwmpYGzz1EB0K2L+RSUxjodGwiudSCwC+tNiHgf5mA\nXQB2f15cEx3FemoEEVFzPCoNRFdB2zuEOtSc3W8zlQKBgQDhzcNDoepesg2akqJV\nJq4YWKaI7C0PGn+Jd0Mm5gZab5iJOLIeNZRc2QdZbhID+6Z1we7Hb+6jfLkCLp0j\nZ2oPoDGsuygTv77CKhHobWq98rGJeGHbbrAmlMUcff5vWxDWzaUhVSS8B3AW1RBj\nFtwifCE40q+vOjRiNqW+Ev8GVQKBgQDZ1/Pd58dEO0xdxZQg1oPkcCx5uBl8KEFT\nWaCwwqKR98CeJXi2OkeUoBD+Z368jn3tS+ufaZGj/0jbNO1ut2mRQbXL3P+LWtOq\n86zbRL4IstErrHSsFIxSOrHxrxFXHuT3iBiDi64v/jyHVjQkFkezrWfM6chB09ws\nNtYSMk0IpQKBgQDLPHMy7YpQfzwlUzPPJohuG2SROtn3jScbqH+FhGZVgbouUBxp\nelo2E5U81ghbE2ao+MudME7/UWQH5cLDufHJbKspSC7zT5M3mbwSkmEP5GANVo/l\nfEQKBb9APNsEiVenruKhFMyCfMNTmaQtO8cZNtaEGYXNVrsNZxhY8yodHQKBgBgl\nN4KBDjUh3XUHUUPSgwvu4v8ayLhaPeNfK9BrwlkrfM4KmTaZfxWaKEgKcKG1qX+D\nyroAmYPz579kPmznJ2xSPDQ8apanmo54M9CZ7fZI26ZblxL7tBHpL4/6N5HQetB0\n5UKvWL85DrxxcZYOYiQoNDkiMHAba2v7J/8cVC2BAoGAe4xzifAbYAjAePodLSkz\nlO8hN0BvzgC9EwigRPNE12MZmL2OXKZOAx5Y30AOwsFkMal4IRFy1oN8fEZcfmyY\nKzl40feITQiyfB60p+WZaQEsPOCjdM9ogMYJEoHIWuEiUZzhUmPGp3SOBKcAXtu0\nTppx2tHZLrk4CseNfXl63iw=\n-----END PRIVATE KEY-----\n',
    client_email:
      'firebase-adminsdk-jbjod@react-student-management.iam.gserviceaccount.com',
    client_id: '112945766404629530327',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jbjod%40react-student-management.iam.gserviceaccount.com'
  })
});

firebase.initializeApp({
  apiKey: 'AIzaSyA9gLyqwpCUiAHfkF6Jj-9KLgL8KfI-i1o',
  authDomain: 'react-student-management.firebaseapp.com',
  projectId: 'react-student-management',
  storageBucket: 'react-student-management.appspot.com',
  messagingSenderId: '293832139595',
  appId: '1:293832139595:web:6f2cf77ce1ad2574247ece'
});

const app = express();
const port = process.env.PORT || 5000;
let firestore = firebase.firestore();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'service-worker.js'));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, error => {
  if (error) throw error;
  console.log('Server running on port ' + port);
});

function createUserInFirebase(docId, idNumber, fullName, email) {
  admin
    .auth()
    .createUser({
      uid: docId,
      email: email,
      password: idNumber,
      displayName: fullName
    })
    .then(userRecord => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
    })
    .catch(error => {
      console.log('Error creating new user:', error);
    });
}

function checkUserInFirebase(docId, { idNumber, fullName, email }) {
  admin
    .auth()
    .getUserByEmail(email)
    .then(user => {
      // User exists
    })
    .catch(err => {
      if (err.code === 'auth/user-not-found') {
        // User doesn't exist yet, create it...
        createUserInFirebase(docId, idNumber, fullName, email);
      }
    });
}

firestore
  .collection('students')
  .get()
  .then(query => {
    query.forEach(doc => {
      checkUserInFirebase(doc.id, doc.data());
    });
  });
