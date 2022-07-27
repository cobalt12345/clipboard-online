/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const subscribeToCopyPasteTextContent = /* GraphQL */ `
  subscription SubscribeToCopyPasteTextContent($secret: String!) {
    subscribeToCopyPasteTextContent(secret: $secret) {
      id
      secret
      body
      publishedAt
    }
  }
`;
export const subscribeToCopyFileContent = /* GraphQL */ `
  subscription SubscribeToCopyFileContent($secret: String!) {
    subscribeToCopyFileContent(secret: $secret) {
      fileContent
      fileName
      id
      secret
      totalParts
      partNo
    }
  }
`;
export const onCreateWebPushSubscription = /* GraphQL */ `
  subscription OnCreateWebPushSubscription {
    onCreateWebPushSubscription {
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
export const onUpdateWebPushSubscription = /* GraphQL */ `
  subscription OnUpdateWebPushSubscription {
    onUpdateWebPushSubscription {
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
export const onDeleteWebPushSubscription = /* GraphQL */ `
  subscription OnDeleteWebPushSubscription {
    onDeleteWebPushSubscription {
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
