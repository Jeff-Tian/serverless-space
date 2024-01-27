import {RemoteGraphQLDataSource} from '@apollo/gateway';
import {GraphQLSchema} from 'graphql';
import {GraphQLDataSourceProcessOptions} from "@apollo/gateway/src/datasources/types";
import {GatewayGraphQLResponse} from "@apollo/server-gateway-interface";
import {DocumentNode, graphql, graphqlSync, parse} from "graphql/index";

export class ExtendedRemoteGraphQLDataSource extends RemoteGraphQLDataSource {
    private schema: GraphQLSchema;
    private apiKey: string;

    constructor(schema: GraphQLSchema, url, apiKey) {
        super({url: url ?? 'http://localhost'});  // 占位符 URL
        this.schema = schema;
        this.apiKey = apiKey;
    }

    // 你可以在这里添加使用 schema 的方法
    async process(
        options: GraphQLDataSourceProcessOptions,
    ): Promise<GatewayGraphQLResponse> {
        if (options.kind === 'loading schema') {
            return graphql({
                schema: this.schema,
                source: options.request.query!,
                variableValues: options.request.variables,
                operationName: options.request.operationName,
                contextValue: options.context,
            });
        }

        return super.process(options);
    }

    willSendRequest({request, context}) {
        request.http?.headers.set('authorization', String(this.apiKey || context.req?.headers['authorization'] || context.req?.headers['Authorization'] || context.req?.headers['AUTHORIZATION']))
    }

    public sdl(): DocumentNode {
        const result = graphqlSync({
            schema: this.schema,
            source: `{ _service { sdl }}`,
        });
        if (result.errors) {
            throw new Error(result.errors.map((error) => error.message).join('\n\n'));
        }

        const sdl = result.data && result.data._service && (result.data._service as any).sdl;
        return parse(sdl);
    }
}

