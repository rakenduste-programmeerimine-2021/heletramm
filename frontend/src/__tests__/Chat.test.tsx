import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { register } from "../serviceWorker";
import Chat, {Props} from "../pages/Chat";
import index, { Context } from '../store/index';

// const contextProvider = ({children: any}) => (
//   <Context.Provider>{children}</Context.Provider>
// )

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

  return render(<Chat {...defaultProps} {...props} />)
}

// test("Connect to chat with friend", async () => {
//   const { findByTestId } = renderChat();

//   const friend = await findByTestId("friend");

//   fireEvent.click(friend);

//   expect(friend).toHaveBeenCalledWith({});
// });

test("Add friend", async () => {
  const onAddFriendSubmit = jest.fn();
  
  const {findByTestId} = renderChat({ onAddFriendSubmit })
  const addFriendButton = await findByTestId("addfriendtoggle");
  fireEvent.click(addFriendButton);

  const friendid = await findByTestId("friendid");

  fireEvent.change(friendid, { target: { value: 1 } });

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