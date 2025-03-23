// codeReviewer.js
import { reviewCode as openaiReviewCode } from "./openaiClient.js";

export async function reviewCode(
  issueDescription,
  fileContents,
  fileTracking = {}
) {
  return openaiReviewCode(issueDescription, fileContents, fileTracking);
}
