export function getAnErrorMessage(response: any) {
  if (typeof response === "string") {
    return response;
  }

  const potentialMessage = [response.error, response.message, response.errors];
  if (typeof response === "object") {
    if (Array.isArray(response.errors) && response.errors.length >= 0) {
      potentialMessage.push(response.errors[0]);
    }

    if (Array.isArray(response.message) && response.message.length >= 0) {
      potentialMessage.push(response.message[0]);
      potentialMessage.push(response.message[0].error);
    }
  }

  // Try to find an error message. If we can't, show a generic message
  return (
    potentialMessage.find((message) => typeof message === "string") ||
    "An error occurred. Please try again."
  );
}
