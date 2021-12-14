import React from "react";
import { render, screen, fireEvent, getByText } from "@testing-library/react";
import { register } from "../serviceWorker";
import Chat, {Props} from "../pages/Chat";
import Index, { Context } from '../store/Index';
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>

function renderChat (props: Partial<Props> = {}) {
  const defaultProps = {
    onRenderingChat() {
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
    },
    onGetFriends() {
      return
    }
  };

  return render(<Index><Chat {...defaultProps} {...props} /></Index>)
}

test("Toggle add friend", async () => {
  const onAddFriendToggle = jest.fn();
  
  const {findByTestId} = renderChat({ onAddFriendToggle });
  const addFriendToggle = await findByTestId("addfriendtoggle");
  fireEvent.click(addFriendToggle);

  expect(onAddFriendToggle).toHaveBeenCalledWith(true);
})


test("Loads chat window properly", async () => {
  
  renderChat()
  const welcomeMessage = screen.getByTestId("welcomemessage");

  expect(welcomeMessage).toHaveTextContent("Click on one of your friends or groups to chat with them!");
})
