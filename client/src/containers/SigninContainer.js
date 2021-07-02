import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserStatus } from '../redux/user/userSelectors';

import { emailSignInStart } from '../redux/user/userActions';

import Signin from '../components/auth/Signin';

const mapStateToProps = createStructuredSelector({
  status: selectCurrentUserStatus
});

export default connect(mapStateToProps, {
  emailSignInStart
})(Signin);
