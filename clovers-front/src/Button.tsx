import "./Button.scss";
import React from "react";

export const Button = ({
  handleClick,
  text,
  className,
  id,
}: {
  handleClick: React.MouseEventHandler;
  text: string;
  className?: string;
  id?: string;
}) => (
  <button
    id={id}
    className={className ? className : "Button"}
    onClick={handleClick}
  >
    {text}
  </button>
);
