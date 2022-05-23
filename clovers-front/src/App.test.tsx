import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders render options", () => {
  render(<App />);
  const render_options = screen.getByText(/render options/i);
  expect(render_options).toBeInTheDocument();
});
