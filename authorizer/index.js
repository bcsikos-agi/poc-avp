const REGION = 'us-east-1'
const previewAWS = require('./javascript_sdk/lib/aws.js')

var AWS = require('aws-sdk');
var unmarshalItem = require('dynamodb-marshaler').unmarshalItem;

const avp = new previewAWS.VerifiedPermissions({ region: REGION });
AWS.config.update({ region: REGION });

async function authorize(Principal, Action, Resource) {
    async function getEntity({ EntityId, EntityType }) {
        var dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

        const TableName = process.env.TABLENAME
        var params = {
            Key: {
                "EntityId": { "S": EntityId },
                "EntityType": { "S": EntityType }
            },
            TableName
        };
        try {
            var result = await dynamodb.getItem(params).promise()
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
        const JSON5 = require('json5')

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


exports.handler = async (event) => {
    let decision = {
        "isAuthorized": false,
        "context": {
            ...event.requestContext
        }
    }

    let verification = new Promise((resolve, reject) => {
        const fs = require('fs')
        const jwt = require('jsonwebtoken')
        var cert = fs.readFileSync('./dev-xz37043p.pem');  // get public key
        jwt.verify(event.headers.authorization.split(' ')[1], cert, function (err, decoded) {
            if (err) {
                reject('unverified!')
            } else {
                console.log(JSON.stringify(decoded))
                resolve(decoded)
            }
        })
    })

    decision.isAuthorized = await verification
        .then(decoded => {
            const Principal = {
                EntityType: 'APP::User',
                EntityId: decoded.sub
            }
            const Action = {
                ActionType: 'API::Action',
                ActionId: event.requestContext.http.method
            }
            const Resource = {
                EntityType: 'API::Path',
                EntityId: `/${event.requestContext.http.path.split('/')[1]}`
            }
            return {
                Principal,
                Action,
                Resource
            }
        })
        .then(({ Principal, Action, Resource }) => {
            console.log(JSON.stringify(Principal))
            console.log(JSON.stringify(Action))
            console.log(JSON.stringify(Resource))
            return authorize(Principal, Action, Resource)
        })
        .catch(err => {
            console.error(err)
            return false
        })
    decision.context.principal = Principal
    console.log(`Decision: ${JSON.stringify(decision)}`)
    return decision
};