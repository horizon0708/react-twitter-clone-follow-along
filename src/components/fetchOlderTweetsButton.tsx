import {
  Button,
  makeStyles,
  CircularProgress,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((t) => ({
  container: {
    marginTop: '2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

type FetchOlderTweetsButtonProps = {
  hasPreviousPage?: boolean
  isLoading?: boolean
  fetchOlderTweets: () => void
}

export const FetchOlderTweetsButton: React.FC<FetchOlderTweetsButtonProps> = ({
  hasPreviousPage,
  fetchOlderTweets,
  isLoading,
}) => {
  const classes = useStyles()

  const renderContent = () => {
    switch (true) {
      case !hasPreviousPage:
        return <span>You are all caught up!</span>
      case isLoading:
        return <CircularProgress />
      default:
        return (
          <Button color="primary" size="small" onClick={fetchOlderTweets}>
            Fetch more tweets!
          </Button>
        )
    }
  }

  return <div className={classes.container}>
		{renderContent()}
	</div>
}
