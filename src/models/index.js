// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { WebPushSubscription, CopyPasteTextContent, CopyFileContent } = initSchema(schema);

export {
  WebPushSubscription,
  CopyPasteTextContent,
  CopyFileContent
};