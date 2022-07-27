/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const allContent = /* GraphQL */ `
  query AllContent {
    allContent {
      id
      secret
      body
      publishedAt
    }
  }
`;
export const getWebPushSubscription = /* GraphQL */ `
  query GetWebPushSubscription($id: ID!) {
    getWebPushSubscription(id: $id) {
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
export const listWebPushSubscriptions = /* GraphQL */ `
  query ListWebPushSubscriptions(
    $filter: ModelWebPushSubscriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWebPushSubscriptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncWebPushSubscriptions = /* GraphQL */ `
  query SyncWebPushSubscriptions(
    $filter: ModelWebPushSubscriptionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncWebPushSubscriptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const subscriptionOnTextContent = /* GraphQL */ `
  query SubscriptionOnTextContent(
    $subscription: String!
    $sortDirection: ModelSortDirection
    $filter: ModelWebPushSubscriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    subscriptionOnTextContent(
      subscription: $subscription
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
