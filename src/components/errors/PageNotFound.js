import React from "react"
import { useHistory } from "react-router-dom"
import urlPrefix from "../../misc/UrlPrefix"
import { Box, Button, Typography } from '@mui/material';

const PageNotFound = () => {
  const history = useHistory()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h1" style={{ color: '#000' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: '#000', marginBottom: "20px" }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" onClick={() => history.push(urlPrefix("/"))}>Back Home</Button>
    </Box>
  );
}

export default PageNotFound
