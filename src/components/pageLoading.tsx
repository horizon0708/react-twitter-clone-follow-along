import React from 'react'
import { CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  loaderContainer: {
      padding: "6em 0 6em 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center", 
  }
}))

export const PageLoading = () => {
    const { loaderContainer } = useStyles()

   return <div className={loaderContainer}>
       <CircularProgress /> 
   </div>
}