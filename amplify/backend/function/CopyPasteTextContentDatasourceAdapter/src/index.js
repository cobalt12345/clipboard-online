/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_CLIPBOARDONLINE_GRAPHQLAPIIDOUTPUT
	API_CLIPBOARDONLINE_GRAPHQLAPIENDPOINTOUTPUT
	API_CLIPBOARDONLINE_GRAPHQLAPIKEYOUTPUT
	FOO
Amplify Params - DO NOT EDIT */

const { v4: uuidv4 } = require('uuid');
const webpush = require('web-push');
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");


webpush.setVapidDetails(
    process.env.REACT_APP_VAPID_SUBJECT,
    process.env.REACT_APP_VAPID_PUBLIC_KEY,
    process.env.REACT_APP_VAPID_PRIVATE_KEY
);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context, callback) => {
    console.debug(`EVENT: ${JSON.stringify(event)}`);
    switch (event?.fieldName) {
        case 'sendCopyFileContent':
            await callbackOnSaveFileContent(event, callback);
        case 'sendCopyPasteTextContent':
            await callbackOnSaveTextContent(event, callback);
    }

    let promises = [];

    try {
        let subscriptions = await getSubscriptions(event.arguments.secret);
        console.debug("Subscriptions: ", subscriptions);
        subscriptions.forEach((subscription) => {
            let result = webpush.sendNotification(subscription,
                JSON.stringify({body: 'Content received via Online clipboard', title: 'Online clipboard'}));
            // .then((result) => console.debug("Web push result", result))
            //     .catch(reason => console.error("Web push error", reason));
            promises.push(result);
        });
    } catch(err) {
        console.error(err)
    }

    await Promise.all(promises);
};

async function callbackOnSaveTextContent(event, callback) {
    const dateTimeISO = new Date().toISOString();
    const copyPasteTextContent = {
        id: uuidv4(),
        secret: event.arguments.secret,
        body: event.arguments.data,
        publishedAt: dateTimeISO,
        createdAt: dateTimeISO,
        updatedAt: dateTimeISO
    }

    callback(null, copyPasteTextContent);
}

async function callbackOnSaveFileContent(event, callback) {

    const copyFileContent = {
        id: uuidv4(),
        secret: event.arguments.secret,
        fileName: event.arguments.fileName,
        fileContent: event.arguments.fileContent
    }

    callback(null, copyFileContent);
}

async function getSubscriptions(secret) {
    const client = new DynamoDBClient({region: 'eu-central-1'});
    const command = new ScanCommand({
        TableName: 'WebPushSubscription-ffffbplvdzfvlhn7quzs6b635q-dev',
        FilterExpression: 'secret = :secret',
        ExpressionAttributeValues: {":secret":{"S":secret}}
    });

    // console.debug('Command: ', JSON.stringify(command));
    try {
        const response = await client.send(command);
        console.debug(JSON.stringify(response));

        return response['Items'].map((item, index, array) => {
            const subscriptionObj = JSON.parse(item.subscription['S']);
            console.debug("Subscription: ", subscriptionObj);

            return subscriptionObj;
        });
    } catch (error) {
        console.error('Couldn\'t get subscriptions', error);
    }
}