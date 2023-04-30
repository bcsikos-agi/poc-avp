// ES6+ example
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb'
import JSON5 from 'json5'
export const handler = async (event) => {
    const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
    const params = {
        FilterExpression: "EntityType = :s",
        ExpressionAttributeValues: {
            ":s": { S: 'API::Role' },
        },
        TableName: process.env.TABLENAME,
    };
    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items
        .map(item => unmarshall(item))
        .map(role => {
            let parents = []
            role.Parents && role.Parents.forEach(parent => {
                if (parent) {
                    parents.push(JSON5.parse(parent))
                }
            })
            return {
                name: role.EntityId
            }
        })
};
