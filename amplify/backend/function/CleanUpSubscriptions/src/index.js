/* Amplify Params - DO NOT EDIT
	API_CLIPBOARDONLINE_GRAPHQLAPIENDPOINTOUTPUT
	API_CLIPBOARDONLINE_GRAPHQLAPIIDOUTPUT
	API_CLIPBOARDONLINE_GRAPHQLAPIKEYOUTPUT
	API_CLIPBOARDONLINE_WEBPUSHSUBSCRIPTIONTABLE_ARN
	API_CLIPBOARDONLINE_WEBPUSHSUBSCRIPTIONTABLE_NAME
	ENV
	FUNCTION_COPYPASTETEXTCONTENTDATASOURCEADAPTER_NAME
	REGION
Amplify Params - DO NOT EDIT */

const { DynamoDBClient, BatchExecuteStatementCommand } = require("@aws-sdk/client-dynamodb");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    let tableName;
    if ( tableName = process.env.TableName) {
        console.debug('Clean up table ' + tableName);
        await run(tableName);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};

const run = async (
    tableName
) => {
    try {
        const client = new DynamoDBClient({region: 'eu-central-1'});
        const params = {
            Statements: [
                {
                    Statement: "DELETE FROM " + tableName,
                    Parameters: [],
                }
            ],
        };
        const data = await client.send(
            new BatchExecuteStatementCommand(params)
        );
        console.log("Success. Items deleted.", data);
        return "Run successfully"; // For unit tests.
    } catch (err) {
        console.error(err);
    }
};