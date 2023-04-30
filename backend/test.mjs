import * as User from './user.mjs'
import * as Group from './group.mjs'
import * as Role from './role.mjs'
import * as Resource from './resource.mjs'
import * as Action from './action.mjs'

// console.log(JSON.stringify(await User.handler({
//     requestContext: {
//         http: {
//             method: 'POST',
//             path: '/user/auth0|6061aa26ce5f52006ad825445'
//         },
//         authorizer: {
//             lambda: {
//                 principal: { "EntityId": "auth0|6061aa26ce5f52006ad82544", "EntityType": "APP::User" }
//             }
//         }
//     },
//     pathParameters: { userID: 'auth0|6061aa26ce5f52006ad825445' },
//     body: '{"name":"auth0|6061aa26ce5f52006ad825445","groups":["users"],"role":"user","privileges":[]}'
// }), null, 2))

// console.log(JSON.stringify(await User.handler({
//     requestContext: {
//         http: {
//             method: 'GET',
//             path: '/user/'
//         },
//         authorizer: {
//             lambda: {
//                 principal: { "EntityId": "auth0|6061aa26ce5f52006ad82544", "EntityType": "APP::User" }
//             }
//         }
//     }
// }), null, 2))

// console.log(JSON.stringify(await Group.handler({

// }), null, 2))

// console.log(JSON.stringify(await Role.handler({

// }), null, 2))

console.log(JSON.stringify(await Resource.handler({
    requestContext: {
        http: {
            method: 'POST',
            path: '/resource/doc4:limited_operation'
        },
        authorizer: {
            lambda: {
                principal: { "EntityId": "auth0|63f759c76bdb53500468a366", "EntityType": "APP::User" }
            }
        }
    }
}), null, 2))

// console.log(JSON.stringify(await Action.handler({

// }), null, 2))
