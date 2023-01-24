import {RemoteGraphQLDataSource} from "@apollo/gateway";

export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({request, context}) {
        request.http?.headers.set('authorization', String(context.req?.headers['authorization'] || context.req?.headers['Authorization'] || context.req?.headers['AUTHORIZATION']))
    }
}
