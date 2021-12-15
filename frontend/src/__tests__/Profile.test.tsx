import { render, screen } from "@testing-library/react";
import React from "react";
import Profile from "../pages/Profile";
import Index, { Context } from '../store/Index';

function renderProfile() {
    render(<Index><Profile /></Index>);
}

describe("when rendered with a `name` prop", () => {
  it("should paste it into the greetings text", () => {
    renderProfile(); 
    expect(
      screen.getByText("Username")
    ).toBeInTheDocument();
  });
});