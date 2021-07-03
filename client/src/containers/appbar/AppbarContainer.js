import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/userSelectors';
import { selectDrawerOpen } from '../../redux/navbar/navbarSelectors';

import { setDrawerOpen } from '../../redux/navbar/navbarActions';
import { signOutStart } from '../../redux/user/userActions';

import Appbar from '../../components/appbar/Appbar';

const mapStateToProps = createStructuredSelector({
  drawerOpen: selectDrawerOpen,
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps, {
  setDrawerOpen,
  signOutStart
})(Appbar);
