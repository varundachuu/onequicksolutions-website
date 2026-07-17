import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the home hero heading", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", {
      name: /build digital systems your business can trust and grow on/i,
    })
  ).toBeInTheDocument();
});
