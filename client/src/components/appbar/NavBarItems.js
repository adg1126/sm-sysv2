import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import ClassIcon from '@material-ui/icons/Class';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles(theme => ({
  drawerItemSelected: {
    color: theme.palette.common.highlightedIndigo
  }
}));

const NavBarItems = ({
  drawerOpen,
  tabIndex,
  currentUserType,
  setTabIndex,
  setDrawerOpen
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const ROUTES = [
    {
      section: 'Manage',
      routes: [
        {
          name: 'Courses',
          icon: () => (
            <ClassIcon
              style={{
                fill:
                  tabIndex === 0
                    ? theme.palette.common.highlightedIndigo
                    : 'white'
              }}
            />
          ),
          route: '/courses',
          index: 0
        },
        currentUserType === 'Instructor'
          ? {
              name: 'Students',
              icon: () => (
                <PeopleIcon
                  style={{
                    fill:
                      tabIndex === 1
                        ? theme.palette.common.highlightedIndigo
                        : 'white'
                  }}
                />
              ),
              route: '/students',
              index: 1
            }
          : null,
        currentUserType === 'Instructor'
          ? {
              name: 'Schedule',
              icon: () => (
                <ScheduleIcon
                  style={{
                    fill:
                      tabIndex === 2
                        ? theme.palette.common.highlightedIndigo
                        : 'white'
                  }}
                />
              ),
              route: '/schedule',
              index: 2
            }
          : null
      ]
    },
    currentUserType === 'Instructor'
      ? {
          section: 'Monitor',
          routes: [
            {
              name: 'Attendance',
              icon: () => (
                <PlaylistAddCheckIcon
                  style={{
                    fill:
                      tabIndex === 3
                        ? theme.palette.common.highlightedIndigo
                        : 'white'
                  }}
                />
              ),
              route: '/attendance',
              index: 3
            }
          ]
        }
      : null
  ];

  return ROUTES.map((s, i) =>
    s !== null ? (
      <List key={i}>
        {drawerOpen ? (
          <Typography
            style={{
              padding: '1em',
              fontSize: 15,
              fontWeight: 500
            }}
          >
            {s.section}
          </Typography>
        ) : null}
        {s.routes.map(item =>
          item !== null ? (
            <ListItem
              button
              component={Link}
              to={item.route}
              key={item.name}
              onClick={() => {
                setTabIndex(item.index);
                setDrawerOpen(false);
              }}
              selected={tabIndex === item.index}
              classes={{ selected: classes.drawerItemSelected }}
            >
              <ListItemIcon>{item.icon()}</ListItemIcon>
              <ListItemText style={{ fontSize: 14 }}>{item.name}</ListItemText>
            </ListItem>
          ) : null
        )}
      </List>
    ) : null
  );
};

export default NavBarItems;
