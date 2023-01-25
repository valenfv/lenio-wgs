import { IconButton, Tooltip } from "@mui/material";
import React from "react";

export const AddAxisButton = (props) => {
    return (
        <Tooltip title="Add to chart">
            <IconButton {...props}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="7" y2="7" stroke="white" stroke-width="3"/>
                    <line x1="7" y1="15" x2="7" stroke="white"  stroke-width="3"/>
                </svg>
            </IconButton>
        </Tooltip>
    );
};

