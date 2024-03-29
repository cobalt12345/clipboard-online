/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sendCopyPasteTextContent = /* GraphQL */ `
  mutation SendCopyPasteTextContent($secret: String!, $data: String!) {
    sendCopyPasteTextContent(secret: $secret, data: $data) {
      id
      secret
      body
      publishedAt
    }
  }
`;
export const sendCopyFileContent = /* GraphQL */ `
  mutation SendCopyFileContent(
    $fileContent: String!
    $fileName: String!
    $secret: String!
    $totalParts: Int!
    $partNo: Int!
  ) {
    sendCopyFileContent(
      fileContent: $fileContent
      fileName: $fileName
      secret: $secret
      totalParts: $totalParts
      partNo: $partNo
    ) {
      fileContent
      fileName
      id
      secret
      totalParts
      partNo
    }
  }
`;
export const createWebPushSubscription = /* GraphQL */ `
  mutation CreateWebPushSubscription(
    $input: CreateWebPushSubscriptionInput!
    $condition: ModelWebPushSubscriptionConditionInput
  ) {
    createWebPushSubscription(input: $input, condition: $condition) {
      id
      subscription
      secret
      expire
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateWebPushSubscription = /* GraphQL */ `
  mutation UpdateWebPushSubscription(
    $input: UpdateWebPushSubscriptionInput!
    $condition: ModelWebPushSubscriptionConditionInput
  ) {
    updateWebPushSubscription(input: $input, condition: $condition) {
      id
      subscription
      secret
      expire
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteWebPushSubscription = /* GraphQL */ `
  mutation DeleteWebPushSubscription(
    $input: DeleteWebPushSubscriptionInput!
    $condition: ModelWebPushSubscriptionConditionInput
  ) {
    deleteWebPushSubscription(input: $input, condition: $condition) {
      id
      subscription
      secret
      expire
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
