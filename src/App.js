import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Frame from "./containers/Frame";
import Users from "./containers/users/Users";
import PeopleIcon from '@mui/icons-material/People';
import CalculateIcon from '@mui/icons-material/Calculate';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Roles from "./containers/roles/Roles";
import Privileges from "./containers/privileges/Privileges";
import Actions from "./containers/actions/Actions";
import ErrorBoundary from "./components/ErrorBoundary";
import './App.css'

export default () => {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
        return (<h2>Loading user profile...</h2>)
    }
    if (!isAuthenticated) {
        loginWithRedirect()
    }
    const menuItems = [
        {
            name: 'Users',
            icon: <PeopleIcon />,
            link: '/users'
        },
        {
            name: 'Roles',
            icon: <BeachAccessIcon />,
            link: '/roles'
        },
        {
            name: 'Privileges',
            icon: <VerifiedUserIcon />,
            link: '/privileges'
        },
        {
            name: 'Actions',
            icon: <CalculateIcon />,
            link: '/actions'
        }
    ]
    const routes = [
        {
            path: "/",
            element: <Frame menuitems={menuItems} />,
            children: [
                {
                    path: "users",
                    errorElement: <ErrorBoundary />,
                    element: <Users />
                },
                {
                    path: "actions",
                    errorElement: <ErrorBoundary />,
                    element: <Actions />
                },
                {
                    path: "roles",
                    errorElement: <ErrorBoundary />,
                    element: <Roles />
                },
                {
                    path: "privileges",
                    errorElement: <ErrorBoundary />,
                    element: <Privileges />
                }
            ]
        },
    ]
    const router = createBrowserRouter(routes);
    return (
        isAuthenticated ?
            <>
                <RouterProvider router={router} />
            </>
            :
            <h2>Redirecting...please wait!</h2>
    )
}