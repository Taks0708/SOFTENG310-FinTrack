import React from "react";
import "../../assets/css/default.css";

export default function DefaultHeader(props) {
    return <h1 className="defaultHeader">{props.children}</h1>;
}
