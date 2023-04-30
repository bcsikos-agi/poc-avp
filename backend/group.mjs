// ES6+ example
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb'
import JSON5 from 'json5'
export const handler = async (event) => {
    const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
    const params = {
        FilterExpression: "EntityType = :s",
        ExpressionAttributeValues: {
            ":s": { S: 'APP::Group' },
        },
        TableName: process.env.TABLENAME,
    };
    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items
        .map(item => unmarshall(item))
        .map(group => {
            let parents = []
            group.Parents && group.Parents.forEach(parent => {
                if (parent) {
                    parents.push(JSON5.parse(parent))
                }
            })
            return {
                name: group.EntityId,
                privileges: group.Attributes.privileges
                    ?
                    group.Attributes.privileges.Set.map(priv => priv.String)
                    :
                    []
            }
        })
};
