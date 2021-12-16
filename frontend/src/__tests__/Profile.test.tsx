import { render, screen } from "@testing-library/react";
import React from "react";
import Profile from "../pages/Profile";
import Index, { Context } from '../store/Index';

function renderProfile() {
    render(<Index><Profile /></Index>);
}

describe("Navbar", () => {
  it("Checks if Username exists", () => {
    renderProfile(); 
    expect(
      screen.getByText("Username")
    ).toBeInTheDocument();
  });

  it("Checks if E-mail exists", () => {
    renderProfile();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
  })

  it("Checks if User ID exists", () => {
    renderProfile();
    expect(screen.getByText("User ID")).toBeInTheDocument();
  })
});