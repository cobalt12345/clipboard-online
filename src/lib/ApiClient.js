import {CopyPasteTextContent, CopyFileContent} from "../models";
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from '../graphql/subscriptions';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';

import { v4 as uuidv4 } from 'uuid';

class ApiClient {

    REMOVE_SUBSCRIPTION_IN_MSEC = process.env.REACT_APP_REMOVE_SUBSCRIPTION_IN_HRS * 60 * 60 * 1000;

    constructor() {
        this.storeWebPushSubscription = this.storeWebPushSubscription.bind(this);
    }

    saveFileContent(fileContent: String, fileName: String, secret: String): CopyFileContent {
        console.debug('Save file %s with secret %s', fileName, secret);
        console.debug('File size', fileContent.length);
        console.debug('File content', fileContent);
        let chunk = fileContent.match(/.{1,200000}/g);
        const numOfParts = chunk.length;
        console.debug('File parts', numOfParts);
        chunk.forEach((element, index, wholeArray) => {
            console.debug(`Part #${index} Length ${element.length}`)
            API.graphql(graphqlOperation(mutations.sendCopyFileContent, {fileContent: element, fileName, secret,
                totalParts: numOfParts, partNo: index}))
        });
    }

    saveTextContent(secret: String, content: String): CopyPasteTextContent {
        console.debug('Save content %s with secret %s', content, secret);

        return API.graphql(graphqlOperation(mutations.sendCopyPasteTextContent, {secret, data: content}));
    }

    awaitFileContent(secret: String, onReceiveFileCallback: function, onSubscriptionErrorCallback: function) {
        const subscription = API.graphql(graphqlOperation(subscriptions.subscribeToCopyFileContent,
            {secret})).subscribe(
            onReceiveFileCallback,
            (errorValue) => {
                    console.error('API subscriptionOnFileContent error(file)',
                    JSON.stringify(errorValue));
                    onSubscriptionErrorCallback("Connection closed. Re-subscribe.")},
            () => console.debug('API subscriptionOnFileContent complete(file)')
        );

        return subscription;
    }

    awaitTextContent(secret: String, onReceiveMessageCallback: function, onSubscriptionErrorCallback: function) {
        const subscription = API.graphql(graphqlOperation(subscriptions.subscribeToCopyPasteTextContent,
            {secret})).subscribe({
            next: onReceiveMessageCallback,
            error: (errorValue => {
                    console.error('API subscriptionOnTextContent error(text)',
                    JSON.stringify(errorValue));
                    onSubscriptionErrorCallback("Connection closed. Re-subscribe.");
            }),
            complete: () => console.debug("API subscriptionOnTextContent complete(text)")
        });

        return subscription;
    }

    storeWebPushSubscription(subscription, secr) {
        console.debug("Create a new subscriptionOnTextContent...");
        return API.graphql(graphqlOperation(mutations.createWebPushSubscription, {
            input: {
                id: uuidv4(),
                secret: secr,
                subscription,
                expire: Date.now() + this.REMOVE_SUBSCRIPTION_IN_MSEC
            }
        }));
    }

}

export default ApiClient;