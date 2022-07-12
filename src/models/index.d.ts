import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class CopyPasteTextContent {
  readonly id: string;
  readonly secret: string;
  readonly body: string;
  readonly publishedAt: string;
  constructor(init: ModelInit<CopyPasteTextContent>);
}

export declare class CopyFileContent {
  readonly fileContent: string;
  readonly fileName: string;
  readonly id: string;
  readonly secret: string;
  constructor(init: ModelInit<CopyFileContent>);
}

type WebPushSubscriptionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class WebPushSubscription {
  readonly id: string;
  readonly subscription: string;
  readonly secret: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<WebPushSubscription, WebPushSubscriptionMetaData>);
  static copyOf(source: WebPushSubscription, mutator: (draft: MutableModel<WebPushSubscription, WebPushSubscriptionMetaData>) => MutableModel<WebPushSubscription, WebPushSubscriptionMetaData> | void): WebPushSubscription;
}