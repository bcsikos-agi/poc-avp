import { Alert, Button, Divider, Grid, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PrivilegeSelectorSimple from "../../components/PrivilegeSelectorSimple";
import UserListSimple from "../../components/UserListSimple";
import deepEqual from "deep-equal";
import { useAuth0 } from "@auth0/auth0-react";
export default () => {
    const { getAccessTokenSilently } = useAuth0()
    const [error, setError] = useState(null)
    if (error) {
        throw new Error(error)
    }
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])
    const [actions, setActions] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const [needSync, setNeedSync] = useState(false)

    useEffect(() => {
        getAccessTokenSilently()
            .then(token => {
                return Promise.allSettled([
                    Promise.resolve(token)
                        .then(token => {
                            return fetch(
                                `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/action`,
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
                        .then(actions => {
                            setActions(actions)
                        })
                    ,
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
                                `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/group`,
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
                        .then(groups => {
                            setGroups(groups)
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

    useEffect(() => {
        setNeedSync(false)
    }, [selectedUser])

    const handlePrivsChange = actual => {
        setNeedSync(!deepEqual(actual, selectedUser.privileges))
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
                    <Typography variant="h4">Invited Users</Typography>
                    <Divider />
                    {users.length > 0
                        ?
                        < UserListSimple users={users} onSelectUser={user => setSelectedUser(user)} />
                        :
                        <LinearProgress />
                    }
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4">
                        {selectedUser ? `${selectedUser.name}'s Privileges` : 'Privilege List'}
                    </Typography>
                    <Grid container direction='column' spacing={1}>
                        <Grid item>
                            <Divider />
                        </Grid>
                        <Grid item>
                            {selectedUser
                                ?
                                <PrivilegeSelectorSimple actions={actions} groups={groups} selected={selectedUser} onChange={handlePrivsChange} />
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