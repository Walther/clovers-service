import "./Button.scss";
import React from "react";

export const Button = ({
  handleClick,
  text,
  className,
}: {
  handleClick: React.MouseEventHandler;
  text: string;
  className?: string;
}) => (
  <button className={className ? className : "Button"} onClick={handleClick}>
    {text}
  </button>
);
