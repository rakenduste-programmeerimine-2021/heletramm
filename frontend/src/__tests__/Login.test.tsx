import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login, {Props} from "../pages/Login";
import Index, { Context } from '../store/Index';

// const mockedUsedNavigate = jest.fn();
// const mockedUsedHref = jest.fn();
// const mockedUsedLocation = jest.fn();
// const mockedUsedResolvedPath = jest.fn();


// jest.mock('react-router', () => ({
//    ...jest.requireActual('react-router-dom') as any,
//   useNavigate: () => mockedUsedNavigate,
//   useHref: () => mockedUsedHref,
//   useLocation: () => mockedUsedLocation,
//   useResolvedPath: () => mockedUsedResolvedPath
// }));

function renderLoginForm (props: Partial<Props> = {}) {
  const defaultProps = {
    onEmailChange() {
      return
    },
    onPasswordChange() {
      return
    },
    onSubmit() {
      return
    }
  };

  return render(<Index><Login {...defaultProps} {...props} /></Index>)
}

test("Login contains correct form with empty values", async () => {
  const { findByTestId } = renderLoginForm();

  const loginform = await findByTestId("login-form");
  expect(loginform).toHaveFormValues({});
});

test("Can insert email", async () => {
  const onEmailChange = jest.fn();
  
  const {findByTestId} = renderLoginForm({ onEmailChange })
  const email = await findByTestId("email");


  fireEvent.change(email, { target: { value: "tests@gmail.com" } });

  expect(onEmailChange).toHaveBeenCalledWith("tests@gmail.com");
})

test("Can insert password", async () => {
  const onPasswordChange = jest.fn();
  
  const {findByTestId} = renderLoginForm({ onPasswordChange })
  const password = await findByTestId("password");


  fireEvent.change(password, { target: { value: "1234" } });

  expect(onPasswordChange).toHaveBeenCalledWith("1234");
})

test("Can submit the login form", async () => {
  const onSubmit = jest.fn();
  
  const {findByTestId} = renderLoginForm({ onSubmit })

  const email = await findByTestId("email");
  const password = await findByTestId("password");
  const submit = await findByTestId("submit");

  fireEvent.change(email, {target: {value: "tests@gmail.com"}})
  fireEvent.change(password, {target: {value: "1234"}});

  fireEvent.click(submit)

  expect(onSubmit).toHaveBeenCalledWith("tests@gmail.com", "1234");
})