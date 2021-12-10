import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { register } from "../serviceWorker";
import Chat, {Props} from "../pages/Chat";
import Login from "../pages/Login";
import Index, { Context } from '../store/Index';
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>

beforeEach(() => {
  mockedAxios.post.mockResolvedValue({ email: 'testacc@gmail.com', password: "1234" });
});

function renderChat (props: Partial<Props> = {}) {
  const defaultProps = {
    onMessageChange() {
      return;
    },
    onConnectingToChat() {
      return;
    },
    onAddFriendChange() {
      return;
    },
    onMessageSubmit() {
      return
    },
    onAddFriendSubmit() {
      return
    }
  };

  return render(<Index><Chat {...defaultProps} {...props} /></Index>)
}

// test("Connect to chat with friend", async () => {
//   const { findByTestId } = renderChat();

//   const friend = await findByTestId("friend");

//   fireEvent.click(friend);

//   expect(friend).toHaveBeenCalledWith({});
// });

test("Add friend", async () => {
  const onAddFriendSubmit = jest.fn();
  
  const {findByTestId} = renderChat({ onAddFriendSubmit });
  const addFriendToggle = await findByTestId("addfriendtoggle");
  const addFriendSubmit = await findByTestId("addfriendsubmit");
  fireEvent.click(addFriendToggle);

  const friendid = await findByTestId("friendid");

  fireEvent.change(friendid, { target: { value: 1 } });

  fireEvent.click(addFriendSubmit);

  expect(onAddFriendSubmit).toHaveBeenCalledWith(1);
})


// test("Can insert email", async () => {
//   const onEmailChange = jest.fn();
  
//   const {findByTestId} = renderRegisterForm({ onEmailChange })
//   const email = await findByTestId("email");


//   fireEvent.change(email, { target: { value: "tests@gmail.com" } });

//   expect(onEmailChange).toHaveBeenCalledWith("tests@gmail.com");
// })

// test("Can insert password", async () => {
//   const onPasswordChange = jest.fn();
  
//   const {findByTestId, debug} = renderRegisterForm({ onPasswordChange })
//   const password = await findByTestId("password");


//   fireEvent.change(password, { target: { value: "1234" } });

//   expect(onPasswordChange).toHaveBeenCalledWith("1234");
// })

// test("Can submit the register form", async () => {
//   const onSubmit = jest.fn();
  
//   const {findByTestId} = renderRegisterForm({ onSubmit })

//   const username = await findByTestId("username");
//   const email = await findByTestId("email");
//   const password = await findByTestId("password");
//   const submit = await findByTestId("submit");

//   fireEvent.change(username, {target: {value: "tests"}});
//   fireEvent.change(email, {target: {value: "tests@gmail.com"}})
//   fireEvent.change(password, {target: {value: "1234"}});

//   fireEvent.click(submit)

//   expect(onSubmit).toHaveBeenCalledWith("tests", "tests@gmail.com", "1234");
// })