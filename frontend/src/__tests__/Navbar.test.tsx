import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { register } from "../serviceWorker";
import Navbar, {Props} from "../components/Navbar";
import { on } from "events";

function renderNavbar () {
  return render(<Navbar />)
}

test("Check burgermenu toggle", async () => {
  const { findByTestId } = renderNavbar();

  const menuButton = await findByTestId("menutogglebutton");
  fireEvent.click(menuButton);

  const loggedInAs = screen.getByText("Logged in as:");

  expect(menuButton).toBeCalled();
});