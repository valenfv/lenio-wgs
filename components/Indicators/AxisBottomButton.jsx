import { IconButton, Tooltip } from "@mui/material";
import React from "react";

export const AxisBottomButton = (props) => {
    return (
        <Tooltip title="X Axis">
            <IconButton {...props}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="13" y2="13" stroke="white" stroke-width="4"/>
                    <line x1="2" y1="15" x2="2" stroke="white" stroke-opacity="0.3" stroke-width="4"/>
                </svg>
            </IconButton>
        </Tooltip>
    );
};

