import React from "react";

export const Button = ({
  handleClick,
  text,
}: {
  handleClick: React.MouseEventHandler;
  text: String;
}) => <button onClick={handleClick}>{text}</button>;
