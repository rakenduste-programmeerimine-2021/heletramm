import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Index, { Context } from '../store';
import Navbar, {Props} from "../components/Navbar";

const mockedUsedNavigate = jest.fn();
const mockedUsedHref = jest.fn();
const mockedUsedLocation = jest.fn();
const mockedUsedResolvedPath = jest.fn();

jest.mock('react-router', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
  useHref: () => mockedUsedHref,
  useLocation: () => mockedUsedLocation,
  useResolvedPath: () => mockedUsedResolvedPath
}));

function renderNavbar () {
  return render(<Index><Navbar /></Index>)
}

describe("When rendered", () => {
  it("Menu button should be in the right corner", () => {
    renderNavbar(); 
    expect(
      screen.getByRole("button")
    ).toBeInTheDocument();
  });
});