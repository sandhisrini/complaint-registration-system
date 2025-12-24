import { gql } from "@apollo/client";

export const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($feedbackInput: FeedbackupInput!) {
    createFeedback(feedbackInput: $feedbackInput) {
      _id
      feedback_text
      createdAt
    }
  }
`;

export const GET_FEEDBACK = gql`
  query GetFeedback($complaintId: ID!) {
    getFeedback(complaintId: $complaintId) {
      _id
      feedback_text
      createdAt
      feedbacker {
        _id
        name
      }
    }
  }
`;
