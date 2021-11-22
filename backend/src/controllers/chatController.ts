export const userDisconnected = (reason: string) => {
    console.log(`User disconnected, reason: ${reason}`);
}

export const userMessage = (message: string) => {
    console.log(message);
}