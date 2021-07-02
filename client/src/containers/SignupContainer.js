import { connect } from 'react-redux';
import { signUpStart } from '../redux/user/userActions';
import Signup from '../components/auth/Signup';

export default connect(null, { signUpStart })(Signup);
