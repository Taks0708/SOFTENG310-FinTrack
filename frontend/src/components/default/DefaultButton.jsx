import React from 'react';
import '../../assets/css/default.css';

export default function DefaultButton(props) {
  return (
    <div className="defaultButtonContainer">
      <button className="defaultButton" onClick={props.onClick}>
        <div className="defaultButtonBackground">
          {props.children}
        </div>
      </button>
    </div>
  );
}