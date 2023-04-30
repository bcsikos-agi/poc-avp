import { Divider, Grid, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import InviteUserForm from "../../components/forms/InviteUserForm";
import UsersList from "./UsersList";
import { useAuth0 } from "@auth0/auth0-react";

export default () => {
    const { getAccessTokenSilently } = useAuth0()
    const [error, setError] = useState(null)
    if (error) {
        throw new Error(error)
    }
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])
    const downloadUsersAndGroups = async () => {
        return getAccessTokenSilently()
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
                            )
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
                        .then(token => fetch(
                            `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/group`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        )
                        )
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
            }
            )
    }

    const handleDelete = user => {
        getAccessTokenSilently()
            .then(token => {
                return fetch(
                    `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/user/${user.name}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
            })
            .then(() => downloadUsersAndGroups())
            .catch(err => console.log(err))
    }

    useEffect(() => {
        downloadUsersAndGroups()
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
    }, [])

    const handleInviteUser = user => {
        getAccessTokenSilently()
            .then(token => {
                return fetch(
                    `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/user/${user.name}`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(user)
                    },
                );
            })
            .then(() => downloadUsersAndGroups())
            .catch(err => { throw new Error(err) })

    }
    return (
        <Grid container direction='column' spacing={2}>
            <Grid item><InviteUserForm onInvite={handleInviteUser} /></Grid>
            <Grid item><Divider /></Grid>
            <Grid item>
                {users.length > 0
                    ?
                    <UsersList users={users} onDelete={handleDelete} onModify={handleInviteUser} />
                    :
                    <LinearProgress />
                }
            </Grid>
        </Grid>
    )
}