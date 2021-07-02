import { createSelector } from 'reselect';
import _ from 'lodash';

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  user => user.currentUser
);

export const selectCurrentUserId = createSelector(
  [selectCurrentUser],
  currentUser => currentUser.id
);

export const selectCurrentUserType = createSelector(
  [selectCurrentUser],
  currentUser => (!_.isEmpty(currentUser) ? currentUser.userType : null)
);

export const selectCurrentUserStatus = createSelector(
  [selectUser],
  user => user.status
);
