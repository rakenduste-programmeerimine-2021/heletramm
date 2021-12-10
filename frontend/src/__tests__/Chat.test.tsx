import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { register } from "../serviceWorker";
import Chat, {Props} from "../pages/Chat";
import Login from "../pages/Login";
import Index, { Context } from '../store/Index';
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>

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
    onAddFriendToggle() {
      return
    }
  };

  return render(<Index><Chat {...defaultProps} {...props} /></Index>)
}

describe("Chat tests", () => {
  test("Add friend toggle", async () => {
    const onAddFriendToggle = jest.fn();

    const fakeFriends = [
      {
        user_id: "1",
        username: "test1"
      },
      {
        user_id: "2",
        username: "test2"
      }
    ]

    mockedAxios.get.mockResolvedValue(fakeFriends);

    const { findByTestId } = renderChat({ onConnectingToChat });

    const friend = await findByTestId("friend");

    expect(friend).toBeInTheDocument();
  });

})

// test("Add friend", async () => {
//   const onAddFriendSubmit = jest.fn();
  
//   const {findByTestId} = renderChat({ onAddFriendSubmit });
//   const addFriendToggle = await findByTestId("addfriendtoggle");
//   const addFriendSubmit = await findByTestId("addfriendsubmit");
//   fireEvent.click(addFriendToggle);

//   const friendid = await findByTestId("friendid");

//   fireEvent.change(friendid, { target: { value: 1 } });

//   fireEvent.click(addFriendSubmit);

//   expect(onAddFriendSubmit).toHaveBeenCalledWith(1);
// })


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