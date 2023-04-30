import { useAuth0 } from "@auth0/auth0-react";
import { Alert, Button, Divider, Grid, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RoleSelectorSimple from "../../components/RoleSelectorSimple";
import UserListSimple from "../../components/UserListSimple";

export default () => {
    const { getAccessTokenSilently } = useAuth0()
    const [error, setError] = useState(null)
    if (error) {
        throw new Error(error)
    }

    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])

    useEffect(() => {
        getAccessTokenSilently()
            .then(token => {
                return Promise.allSettled([
                    Promise.resolve(token)
                        .then(token => {
                            return fetch(
                                `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/user`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                        })
                        .then(resp => {
                            if (resp.status === 403) {
                                throw new Error(resp.message)
                            }
                            return resp.json()
                        })
                        .then(users => {
                            setUsers(users)
                        })
                    ,
                    Promise.resolve(token)
                        .then(token => {
                            return fetch(
                                `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/role`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                        })
                        .then(resp => {
                            if (resp.status === 403) {
                                throw new Error(resp.message)
                            }
                            return resp.json()
                        })
                        .then(roles => {
                            setRoles(roles)
                        })
                ])
                    .then(promises => {
                        promises.forEach(promise => {
                            if (promise.status === "rejected") {
                                throw new Error('You are blocked or not invited to the Application!')
                            }
                        })
                    })
                    .catch(err => {
                        setError(err)
                    })
            })

    }, [])
    const [selectedUser, setSelectedUser] = useState()
    const [needSync, setNeedSync] = useState(false)

    useEffect(() => {
        setNeedSync(false)
    }, [selectedUser])

    const handleRoleChange = role => {
        setNeedSync(role === selectedUser.role)
    }

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="flex-left"
                alignItems="stretch"
                spacing={5}
            >
                <Grid item xs={6}>
                    <Grid container direction='column' spacing={2}>
                        <Grid item>
                            <Typography variant="h4">Invited Users</Typography>
                            <Divider />
                        </Grid>
                        <Grid item>
                            {users.length > 0
                                ?
                                <UserListSimple users={users} onSelectUser={user => setSelectedUser(user)} />
                                :
                                <LinearProgress />
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container direction='column' spacing={2}>
                        <Grid item>
                            <Typography variant="h4">
                                {selectedUser ? `${selectedUser.name}` : 'Role List'}
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item>
                            {
                                selectedUser && roles.length > 0
                                    ?
                                    <RoleSelectorSimple roles={roles} selected={selectedUser.role} onChange={handleRoleChange} />
                                    :
                                    <Alert severity="info">No user selected, please select a user!</Alert>
                            }
                        </Grid>
                        <Grid item>
                            <Button variant='outlined' disabled={!needSync}>Sync with AVP</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}