import { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb'
import JSON5 from 'json5'
export const handler = async (event) => {
    const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
    switch (event.requestContext.http.method) {
        case 'GET': {
            let params = {
                FilterExpression: "EntityType = :s",
                ExpressionAttributeValues: {
                    ":s": { S: 'APP::User' },
                },
                TableName: process.env.TABLENAME,
            };
            let data = await ddbClient.send(new ScanCommand(params));
            return data.Items
                .map(item => unmarshall(item))
                .map(user => {
                    let parents = []
                    user.Parents && user.Parents.forEach(parent => {
                        if (parent) {
                            parents.push(JSON5.parse(parent))
                        }
                    })
                    return {
                        name: user.EntityId,
                        groups: parents
                            .filter(parent => parent.EntityType === 'APP::Group')
                            .map(group => group.EntityId),
                        role: parents
                            .filter(parent => parent.EntityType === 'API::Role')
                            .map(role => role.EntityId)[0] || null,
                        privileges: user.Attributes.privileges
                            ?
                            user.Attributes.privileges.Set.map(priv => priv.String)
                            :
                            [],
                        blocked: user.Attributes.blocked.String
                    }
                })
        }
        case 'POST': {
            let userID = event.pathParameters.userID
            let user = JSON.parse(event.body)
            let groups = user.groups.map(group => {
                return `{ EntityType: 'APP::Group', EntityId: '${group}' }`
            })
            let role = `{ EntityType: 'API::Role', EntityId: '${user.role}' }`
            let params = {
                TableName: process.env.TABLENAME,
                Item: marshall({
                    EntityId: userID,
                    EntityType: 'APP::User',
                    Attributes: {
                        blocked: { String: user.blocked ? JSON.stringify(user.blocked) : "false" },
                        privileges: {
                            Set: [
                                { String: '_limited_operation' }
                            ]
                        }
                    },
                    Parents: new Set([
                        ...groups,
                        role
                    ])
                }),
            };
            await ddbClient.send(new PutItemCommand(params));
            break
        }
        case 'DELETE': {
            let userID = event.pathParameters.userID
            let params = {
                TableName: process.env.TABLENAME,
                Key: marshall({
                    EntityId: userID,
                    EntityType: 'APP::User',
                }),
            }
            await ddbClient.send(new DeleteItemCommand(params))
            break
        }
        default:
            break
    }
};
