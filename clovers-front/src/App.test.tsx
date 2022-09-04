import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders clovers web frontend", () => {
  render(<App />);
  const title = screen.getByText(/clovers web frontend/i);
  expect(title).toBeInTheDocument();
});
