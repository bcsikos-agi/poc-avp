import { useAuth0 } from "@auth0/auth0-react";
import { Divider, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import DoActionForm from "../../components/forms/DoActionForm";

export default () => {
    const { getAccessTokenSilently } = useAuth0()
    const [error, setError] = useState(null)
    if (error) {
        throw new Error(error)
    }
    const [log, setLog] = useState()
    const [resources, setResources] = useState([])
    const [actions, setActions] = useState([])
    const [buttonActive, setButtonActive] = useState(false)
    useEffect(() => {
        getAccessTokenSilently()
            .then(token => {
                return Promise.allSettled([
                    Promise.resolve(token)
                        .then(token => {
                            return fetch(
                                `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/resource`,
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
                        .then(resources => {
                            setResources(Array.isArray(resources) ? resources : [])
                        })
                    ,
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
    const addLog = (msg) => {
        setLog(prevLog => prevLog ? prevLog + '\n' + msg : msg)
    }
    const handleDo = ({ action, resource }) => {
        setButtonActive(false)
        setLog('')
        let newLog = `doing: "${action}" on resource "${resource}"`
        addLog(newLog)
        getAccessTokenSilently()
            .then(token => {
                addLog(`sending: POST to /resource/${resource}:${action}`)
                return fetch(
                    `https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/resource/${resource}:${action}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        method: 'POST',
                    },
                );
            })
            .then(resp => {
                addLog(`received: ${resp.status}`)
                return resp.json()
            })
            .then(json => {
                addLog(`body: ${json.message}`)
            })
            .catch(err => {
                addLog(`error: ${err.message}`)
            })

    }
    return (
        <>
            <Grid container direction='column' spacing={2}>
                <Grid item xs={2}>
                    <DoActionForm actions={actions} resources={resources} onDo={handleDo} buttonActive={buttonActive} />
                </Grid>
                <Grid item xs={1}>
                    <Divider />
                </Grid>
                <Grid item xs={9}>
                    <TextField fullWidth
                        disabled
                        id="outlined-multiline-static"
                        multiline
                        rows={8}
                        value={log}
                    />
                </Grid>
            </Grid>
        </>
    )
}