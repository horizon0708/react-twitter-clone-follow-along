import { Badge, CircularProgress, createStyles, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useFavoriteSubscription } from '../hooks/useFavoritesSubscription';
import Popover from '@material-ui/core/Popover';
import { useQuery } from 'react-query';
import { getFavoriteByIds } from '../api/favorites';
import { NotificationCard } from './notificationCard';
import { toRelativeTime } from '../util/dates';

const useStyles = makeStyles((theme) =>
  createStyles({
    popoverInner: {
      "& > *": {
        margin: '0.3em 0 0.3em 0'
      }
    },
    popoverOuter: {
      backgroundColor: "transparent",
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    }
  }),
);

export const NotificationBell: React.FC<{}> = () => {
    const classes = useStyles()
    const { newFavorites, clearNewFavorites } = useFavoriteSubscription()
    const [favoritesBuffer, setFavoritesBuffer] = useState<number[]>([])
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    // TODO this could probabyl be better done
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const { data, isLoading } = useQuery(
        ['favoritedTweet', favoritesBuffer],
        async ()=> {
            return await getFavoriteByIds(favoritesBuffer)
        },
        {
            enabled: !!favoritesBuffer.length
        }
    )

    const onClick = (event: React.MouseEvent<any>) => {
        setAnchorEl(event.currentTarget);
        setFavoritesBuffer(newFavorites)
        clearNewFavorites()
    }

    const handleClose = () => {
        setAnchorEl(null);
        setFavoritesBuffer([]);
    };
    console.log(newFavorites)
    console.log(newFavorites.length)

    return (
        <>
            <Badge color="secondary" badgeContent={newFavorites.length}>
                <NotificationsIcon onClick={onClick}/>
            </Badge>
            <Popover
                PaperProps={{ elevation: 0, className: classes.popoverOuter }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
            <div className={classes.popoverInner}>
                {
                    isLoading && <CircularProgress /> 
                }
                {
                    !isLoading && data?.map((x,i) => {
                        return <NotificationCard 
                        key={x.id}
                        avatarUrl={x.favorited_user.avatar_url}
                        username={x.favorited_user.username}
                        at={toRelativeTime(x.insertedat)}
                        content={"a"}
                        />
                    })
                }
            </div>
      </Popover>
        </>
    )
}