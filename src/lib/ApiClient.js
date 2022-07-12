import {CopyPasteTextContent, CopyFileContent} from "../models";
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from '../graphql/subscriptions';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';

import { v4 as uuidv4 } from 'uuid';

class ApiClient {

    constructor(onReceiveMessageCallback: function, onReceiveFileCallback: function) {
        this.onReceiveMessageCallback = onReceiveMessageCallback;
        this.onReceiveFileCallback = onReceiveFileCallback;

        this.storeWebPushSubscription = this.storeWebPushSubscription.bind(this);
    }

    saveFileContent(fileContent: String, fileName: String, secret: String): CopyFileContent {
        console.debug('Save file %s with secret %s', fileName, secret);

        return API.graphql(graphqlOperation(mutations.sendCopyFileContent, {fileContent, fileName, secret}));
    }

    saveTextContent(secret: String, content: String): CopyPasteTextContent {
        console.debug('Save content %s with secret %s', content, secret);

        return API.graphql(graphqlOperation(mutations.sendCopyPasteTextContent, {secret, data: content}));
    }

    getFileContent(secret: String) {
        const subscription = API.graphql(graphqlOperation(subscriptions.subscribeToCopyFileContent,
            {secret})).subscribe(
            this.onReceiveFileCallback,
            (errorValue) => {console.error('API subscriptionOnFileContent error(file)', JSON.stringify(errorValue))},
            () => console.debug('API subscriptionOnFileContent complete(file)')
        );

        return subscription;
    }

    getTextContent(secret: String) {
        const subscription = API.graphql(graphqlOperation(subscriptions.subscribeToCopyPasteTextContent,
            {secret})).subscribe({
            next: this.onReceiveMessageCallback,
            error: (errorValue => {console.error('API subscriptionOnTextContent error(text)', JSON.stringify(errorValue))}),
            complete: () => console.debug("API subscriptionOnTextContent complete(text)")
        });

        return subscription;
    }

    async storeWebPushSubscription(subscription, secret) {
        console.debug(`Store webpush subscription ${subscription} with secret ${secret}`);

        let foundSubscriptions = await API.graphql(graphqlOperation(queries.listWebPushSubscriptions,
            {subscription}));

        // console.debug("Found subscriptions", JSON.stringify(foundSubscriptions));

        if (foundSubscriptions?.data?.subscription?.items?.length) {
            console.debug("Update found subscriptions...")
            let promises = [];
            for (const item of foundSubscriptions.data.subscription.items) {
                const index = foundSubscriptions.data.subscription.items.indexOf(item);
                console.debug('Update item of the same version', JSON.stringify(item), index)
                promises.push(API.graphql(graphqlOperation(mutations.updateWebPushSubscription, {
                    input: {
                        id: item.id,
                        secret: secret,
                        subscription,
                        _version: item._version

                    }
                })))
            }
            return await Promise.all(promises);
        } else {
            console.debug("Create a new subscriptionOnTextContent...");
            return API.graphql(graphqlOperation(mutations.createWebPushSubscription, {
                input: {
                    id: uuidv4(),
                    secret,
                    subscription
                }
            }));
        }
    }
}

export default ApiClient;