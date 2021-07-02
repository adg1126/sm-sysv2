import { takeLatest, put, all, call } from 'redux-saga/effects';
import moment from 'moment';
import {
  EMAIL_SIGN_IN_START,
  CHECK_USER_SESSION,
  SIGN_OUT_START,
  SIGN_UP_START,
  SIGN_UP_SUCCESS
} from './userActionTypes';
import {
  auth,
  createUserProfileDocument,
  checkIfAuthenticated,
  getCurrentUser
} from '../../config/firebase';
import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signOutStart
} from './userActions';

export function* getSnapshotFromUserAuth(userAuth, additionalData) {
  try {
    const userRef = yield call(
      createUserProfileDocument,
      userAuth,
      additionalData
    );
    const userSnapshot = yield userRef.get();
    yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
  } catch (err) {
    yield put(signInFailure(err));
  }
}

export function* signInWithEmail({ payload: { email, password } }) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield getSnapshotFromUserAuth(user);
  } catch (err) {
    yield put(signInFailure(err.message));
  }
}

export function* onEmailSignInStart() {
  yield takeLatest(EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* signUp({
  payload: { email, password, displayName, userType }
}) {
  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    yield put(
      signUpSuccess({ user, additionalData: { displayName, userType } })
    );
  } catch (err) {
    yield put(signInFailure(err));
  }
}

export function* onSignUpStart() {
  yield takeLatest(SIGN_UP_START, signUp);
}

export function* signInAfterSignUp({ payload: { user, additionalData } }) {
  yield getSnapshotFromUserAuth(user, additionalData);
}

export function* onSignUpSuccess() {
  yield takeLatest(SIGN_UP_SUCCESS, signInAfterSignUp);
}

// export function* isUserAuthenticated() {
//   try {
//     const userAuth = yield getCurrentUser();
//     if (!userAuth) return;

//     try {
//       const userRef = yield call(checkIfAuthenticated, userAuth);
//       const userSnapshot = yield userRef.get();
//       yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
//     } catch (err) {
//       yield put(signInFailure(err));
//     }
//   } catch (err) {
//     yield put(signInFailure(err));
//   }
// }

export function* isUserAuthenticated() {
  try {
    const userAuth = yield getCurrentUser();
    if (!userAuth) return;

    try {
      const userRef = yield call(checkIfAuthenticated, userAuth);
      const userSnapshot = yield userRef.get();

      const { userType, timestamp } = userSnapshot.data();

      if (userType === 'Instructor') {
        yield put(
          signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() })
        );
      } else {
        const userTimestamp = timestamp.toDate(),
          now = moment().toDate();
        const userSesseionInMS = moment(now - userTimestamp).valueOf(),
          fourhrsInMS = 60 * 4 * 60 * 1000;

        userSesseionInMS >= fourhrsInMS
          ? yield put(signOutStart())
          : yield put(
              signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() })
            );
      }
    } catch (err) {
      yield put(signInFailure(err));
    }
  } catch (err) {
    yield put(signInFailure(err));
  }
}

export function* onCheckUserSession() {
  yield takeLatest(CHECK_USER_SESSION, isUserAuthenticated);
}

export function* signOut() {
  try {
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (err) {
    yield put(signOutFailure(err));
  }
}

export function* onSignOutStart() {
  yield takeLatest(SIGN_OUT_START, signOut);
}

export function* userSagas() {
  yield all([
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess)
  ]);
}
