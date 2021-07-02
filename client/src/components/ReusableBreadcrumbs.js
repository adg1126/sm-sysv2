import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import MateriaUILink from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles({
  breadcrumbsContainer: { margin: '1em 0' },
  link: {
    display: 'flex',
    cursor: 'pointer',
    '&:hover': { color: 'blue' }
  }
});

const ReusableBreadcrumbs = ({ routesArr }) => {
  const classes = useStyles();

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize='small' />}
      aria-label='breadcrumb'
    >
      {routesArr.map(({ route, name }, i) => (
        <MateriaUILink
          key={i}
          to={route}
          component={Link}
          color='inherit'
          className={classes.link}
        >
          {name}
        </MateriaUILink>
      ))}
    </Breadcrumbs>
  );
};

export default ReusableBreadcrumbs;
