import React from "react";
import SelectedListItem from "./SelectedListItem";

export default (props) => {
    return (
        <>
            <SelectedListItem users={props.users} onSelect={props.onSelectUser} />
        </>
    )
}