import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { AccountCircle } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { useAuth } from '../contexts/authContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export type NavBarProps = {
}

export const NavBar = ({}) => {
  const classes = useStyles();
  const  { session } = useAuth() 

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
                <Link underline="none" component={RouterLink} to="/" color="inherit">
              SupaTwitter
            </Link>
          </Typography>
          {
              session ? 
                <Link underline="none" component={RouterLink} to="/signout" color="inherit">
                    <Button color="inherit">
                        Sign out
                    </Button>
                </Link>
               :
               <Link underline="none" to="/signin" component={RouterLink} color="inherit">
                    <Button color="inherit">
                        Sign In
                    </Button>
               </Link>
              
          }
            <IconButton color="inherit">
              <Badge color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Link underline="none" component={RouterLink} to="/profile" color="inherit">
              <IconButton color="inherit">
                <Badge color="secondary">
                  <AccountCircle />
                </Badge>
              </IconButton>
            </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}