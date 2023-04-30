import { Grid, Typography } from "@mui/material";
import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
export default () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <div>This page doesn't exist!</div>;
        }

        if (error.status === 401) {
            return <div>You aren't authorized to see this</div>;
        }

        if (error.status === 503) {
            return <div>Looks like our API is down</div>;
        }

        if (error.status === 418) {
            return <div>🫖</div>;
        }
    }

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            paddingTop={15}
        >
            <Grid item>
                <Typography variant="h4">{error.message}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h3">Please contact an Admin person!</Typography>
            </Grid>
        </Grid>
    );
}