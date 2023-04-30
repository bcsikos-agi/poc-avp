// ES6+ example
import { DynamoDBClient, ScanCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb'
import JSON5 from 'json5'
import previewAWS from './javascript_sdk/lib/aws.js'
import { unmarshalItem } from 'dynamodb-marshaler'

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });

async function authorize(Principal, Action, Resource) {
    async function getEntity({ EntityId, EntityType }) {

        const TableName = process.env.TABLENAME
        var params = {
            Key: {
                "EntityId": { "S": EntityId },
                "EntityType": { "S": EntityType }
            },
            TableName
        };
        try {
            var result = await ddbClient.send(new GetItemCommand(params))
            return unmarshalItem(result.Item)
        } catch (error) {
            throw error;
        }
    }
    const Context = {
        time: {
            Long: 123456
        }
    }
    const SliceComplement = {
        Entities: [ // max 100
        ]
    }
    async function recursiveLoad(entityJSON) {

        let entity = typeof entityJSON === 'string'
            ?
            JSON5.parse(entityJSON)
            :
            JSON5.parse(JSON.stringify(entityJSON))
        let slice = {
            Identifier: {
                EntityId: entity.EntityId,
                EntityType: entity.EntityType
            }
        }
        if (Array.isArray(entity.Parents)) {
            slice.Parents = []
            entity.Parents.forEach(parent => {
                slice.Parents.push(JSON5.parse(parent))
            })
        }
        if (entity.Attributes) {
            slice.Attributes = JSON5.parse(JSON.stringify(entity.Attributes))
        }
        SliceComplement.Entities.push(slice)
        if (entity.Parents) {
            let parents = await Promise.all(
                entity.Parents
                    .map(parent => getEntity(JSON5.parse(parent)))
            )
            await Promise.all(parents.map(parentJSON => recursiveLoad(parentJSON)))
        }
    }
    await recursiveLoad(await getEntity(Principal))
    await recursiveLoad(await getEntity(Resource))
    const PolicyStoreIdentifier = 'ps-ea10a8d2-a005-46b3-a98f-31b2d073c766'
    console.log(JSON.stringify(SliceComplement))
    const authResult = await avp.isAuthorized({
        PolicyStoreIdentifier,
        Principal,
        Action,
        Resource,
        Context,
        SliceComplement
    }).promise();
    console.log(JSON.stringify(authResult))
    return authResult.Decision === 'Allow'
}

export const handler = async (event) => {
    switch (event.requestContext.http.method) {
        case 'GET':
            const params = {
                FilterExpression: "EntityType = :s",
                ExpressionAttributeValues: {
                    ":s": { S: 'APP::Resource' },
                },
                TableName: process.env.TABLENAME,
            };
            const data = await ddbClient.send(new ScanCommand(params));
            return data.Items
                .map(item => unmarshall(item))
                .map(resource => {
                    let parents = []
                    resource.Parents && resource.Parents.forEach(parent => {
                        if (parent) {
                            parents.push(JSON5.parse(parent))
                        }
                    })
                    return {
                        name: resource.EntityId
                    }
                })
        case 'POST':
            const REGION = 'us-east-1'
            const avp = new previewAWS.VerifiedPermissions({ region: REGION });
            async function getEntity({ EntityId, EntityType }) {

                const TableName = process.env.TABLENAME
                var params = {
                    Key: {
                        "EntityId": { "S": EntityId },
                        "EntityType": { "S": EntityType }
                    },
                    TableName
                };
                try {
                    var result = await ddbClient.send(new GetItemCommand(params))
                    return unmarshalItem(result.Item)
                } catch (error) {
                    throw error;
                }
            }
            const Context = {
                time: {
                    Long: 123456
                }
            }
            const SliceComplement = {
                Entities: [ // max 100
                ]
            }
            async function recursiveLoad(entityJSON) {

                let entity = typeof entityJSON === 'string'
                    ?
                    JSON5.parse(entityJSON)
                    :
                    JSON5.parse(JSON.stringify(entityJSON))
                let slice = {
                    Identifier: {
                        EntityId: entity.EntityId,
                        EntityType: entity.EntityType
                    }
                }
                if (Array.isArray(entity.Parents)) {
                    slice.Parents = []
                    entity.Parents.forEach(parent => {
                        slice.Parents.push(JSON5.parse(parent))
                    })
                }
                if (entity.Attributes) {
                    slice.Attributes = JSON5.parse(JSON.stringify(entity.Attributes))
                }
                SliceComplement.Entities.push(slice)
                if (entity.Parents) {
                    let parents = await Promise.all(
                        entity.Parents
                            .map(parent => getEntity(JSON5.parse(parent)))
                    )
                    await Promise.all(parents.map(parentJSON => recursiveLoad(parentJSON)))
                }
            }
            const Principal = event.requestContext.authorizer.lambda.principal
            const resourceAndAction = event.requestContext.http.path.split(':')
            const Action = {
                ActionType: 'APP::Action',
                ActionId: resourceAndAction[1]
            }
            const Resource = {
                EntityType: 'APP::Resource',
                EntityId: resourceAndAction[0].split('/')[2]
            }
            await recursiveLoad(await getEntity(Principal))
            await recursiveLoad(await getEntity(Resource))
            const PolicyStoreIdentifier = 'ps-ea10a8d2-a005-46b3-a98f-31b2d073c766'
            console.log(JSON.stringify(SliceComplement))
            const authResult = await avp.isAuthorized({
                PolicyStoreIdentifier,
                Principal,
                Action,
                Resource,
                Context,
                SliceComplement
            }).promise();
            console.log(JSON.stringify(authResult))
            return {
                message: authResult.Decision
            }
        default:
            break;
    }

};
