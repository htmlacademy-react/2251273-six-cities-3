
type MessageType = {
  message: string;
}

// Create PageNotFound
function Message({message}: MessageType): JSX.Element {
  return (
    <h1>{message}</h1>
  );
}

// Export PageNotFound
export { Message };
