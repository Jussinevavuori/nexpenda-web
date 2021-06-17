import { AnyFailure } from "../../result/Failures";
import { LogService } from "../../services/LogService";

type ActionType = "resetPassword" | "transactionForm";

export function getErrorMessage(
  actionType: ActionType,
  failure: AnyFailure
): string {
  switch (actionType) {
    case "resetPassword":
      if (failure.reason === "network") {
        switch (failure.code) {
          case "request/invalid-request-data":
            return "Invalid email or password.";
          case "auth/user-not-found":
            return "No user exists with that email.";
        }
      }
      break;
    case "transactionForm":
      if (failure.reason === "network") {
        switch (failure.code) {
          case "transaction/already-exists":
            return "Could not post transaction due to overlapping IDs";
          case "auth/unauthorized":
            return "Cannot edit another user's transaction";
        }
      }
      break;
  }

  return getDefaultErrorMessage(failure);
}

export function getDefaultErrorMessage(failure: AnyFailure): string {
  switch (failure.reason) {
    case "already-recovered":
      return "Already recovered";
    case "error":
      return "An error occured";
    case "event-not-found":
      return "Event not found";
    case "file-not-uploaded":
      return "No file was uploaded";
    case "file-reader-aborted":
      return "File reading failed";
    case "file-reader-failure":
      return "File reading failed";
    case "file-reader-invalid-type":
      return "Invalid filetype";
    case "file-reader-missing-file-failure":
      return "File missing";
    case "file-reader-no-event-target":
      return "File reading failed";
    case "invalidServerResponse":
      return "Invalid server response received";
    case "spreadsheet-no-file-created":
      return "No spreadsheet file created";
    case "spreadsheet-read-file-failure":
      return "Failed to read spreadsheet";
    case "spreadsheet-read-row-failure":
      return "Failed to read spreadsheet row";
    case "stripe-initialization-failure":
      return "Failed to initialize stripe";
    case "unimplemented":
      return "Feature is not yet implemented";
    case "unknown":
      return "An unknown error occured";
    case "network": {
      switch (failure.code) {
        case "auth/email-already-confirmed":
          return "Email was already confirmed";
        case "auth/email-not-confirmed":
          return "Email not yet confirmed, confirm your email to proceed";
        case "auth/invalid-credentials":
          return "Wrong password or user does not have password";
        case "auth/invalid-token":
          return "Invalid authentication, log in again to proceed";
        case "auth/missing-token":
          return "Not authenticated, log in to proceed";
        case "auth/unauthenticated":
          return "Not authenticated, log in to proceed";
        case "auth/unauthorized":
          return "Operation not allowed";
        case "auth/user-already-exists":
          return "User already exists";
        case "auth/user-has-no-password":
          return "User has no password";
        case "auth/user-not-found":
          return "User not found";
        case "budget/already-exists":
          return "A budget with that ID already exists";
        case "budget/limit-exceeded":
          return "Cannot create more budgets, upgrade to premium for more";
        case "budget/not-found":
          return "Could not find budget";
        case "database/access-failure":
          return "Server error";
        case "failure/cors":
          return "Server communication error";
        case "failure/error":
          return "Server error";
        case "failure/unimplemented":
          return "Feature is not yet implemented";
        case "failure/unknown":
          return "Unknown server error";
        case "failure/validation":
          return "Server error";
        case "file/failure":
          return "Invalid file sent to server";
        case "file/too-large":
          return "File was too large";
        case "image/failure":
          return "An error occured when processing image";
        case "mail/error":
          return "An error occured while sending mail";
        case "request/invalid-request-data":
          return "Invalid data";
        case "request/missing-query-parameters":
          return "Missing query parameters";
        case "request/missing-url-parameters":
          return "Missing URL parameters";
        case "request/too-many-requests":
          return "Slow down, you are trying too fast. Try again later";
        case "server/failure-formulating-request":
          return "Failed to create request";
        case "server/initialization-failure":
          return "Failed to initialize request";
        case "server/unavailable":
          return "Server unavailable";
        case "transaction/already-exists":
          return "A transaction with that ID already exists";
        case "transaction/limit-exceeded":
          return "Cannot create more transactions, upgrade to premium for more";
        case "transaction/not-found":
          return "Could not find transaction";
      }
    }
  }

  LogService.warn({ message: "Uncaught error code:", data: { failure } });

  return "An error occured.";
}
