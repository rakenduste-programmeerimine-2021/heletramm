import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Register, {Props} from "../pages/Register"

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

function renderRegisterForm (props: Partial<Props> = {}) {
  const defaultProps = {
    onUsernameChange() {
      return
    },
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

  return render(<Register {...defaultProps} {...props} />)
}

test("Register contains correct form with empty values", async () => {
  const { findByTestId } = renderRegisterForm();

  const registerForm = await findByTestId("register-form");
  expect(registerForm).toHaveFormValues({});
});

test("Can insert username", async () => {
  const onUsernameChange = jest.fn();
  
  const {findByTestId, debug} = renderRegisterForm({ onUsernameChange })
  const username = await findByTestId("username");


  fireEvent.change(username, { target: { value: "tests" } });

  expect(onUsernameChange).toHaveBeenCalledWith("tests");
})

test("Can insert email", async () => {
  const onEmailChange = jest.fn();
  
  const {findByTestId} = renderRegisterForm({ onEmailChange })
  const email = await findByTestId("email");


  fireEvent.change(email, { target: { value: "tests@gmail.com" } });

  expect(onEmailChange).toHaveBeenCalledWith("tests@gmail.com");
})

test("Can insert password", async () => {
  const onPasswordChange = jest.fn();
  
  const {findByTestId, debug} = renderRegisterForm({ onPasswordChange })
  const password = await findByTestId("password");


  fireEvent.change(password, { target: { value: "1234" } });

  expect(onPasswordChange).toHaveBeenCalledWith("1234");
})

test("Can submit the register form", async () => {
  const onSubmit = jest.fn();
  
  const {findByTestId} = renderRegisterForm({ onSubmit })

  const username = await findByTestId("username");
  const email = await findByTestId("email");
  const password = await findByTestId("password");
  const submit = await findByTestId("submit");

  fireEvent.change(username, {target: {value: "tests"}});
  fireEvent.change(email, {target: {value: "tests@gmail.com"}})
  fireEvent.change(password, {target: {value: "1234"}});

  fireEvent.click(submit)

  expect(onSubmit).toHaveBeenCalledWith("tests", "tests@gmail.com", "1234");
})