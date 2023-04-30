import React from "react";
import EnhancedTable from "../../components/EnhancedTable";

export default ({ users, onDelete, onModify }) => {
    let headers = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Username',
        },
        {
            id: 'blocked',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
        {
            id: 'groups',
            numeric: false,
            disablePadding: false,
            label: 'Groups',
        }
    ]

    return (
        <>
            <EnhancedTable title='Invited Users' headers={headers} rows={users} onDelete={onDelete} onModify={onModify} />
        </>
    )
}