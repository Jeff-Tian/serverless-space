import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthenticatedDataSource } from "./authenticated.data.source";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            server: {
                // ... Apollo server options
                path: '/stg/gateway',
                cors: true
            },
            gateway: {
                supergraphSdl: new IntrospectAndCompose({
                    subgraphs: [
                        { name: 'orders', url: 'https://uni-orders-jeff-tian.cloud.okteto.net/graphql' },
                        { name: 'face-swap', url: 'https://face-swap-jeff-tian.cloud.okteto.net/graphql' },
                        { name: 'sls', url: 'https://zcjk76jr21.execute-api.us-east-1.amazonaws.com/stg/nest/graphql' },
                        {
                            name: 'user-service',
                            url: 'https://brickverse-user-service-gracewen1.cloud.okteto.net/graphql'
                        }
                    ],
                    subgraphHealthCheck: false,
                }),
                buildService: ({ name, url }) => {
                    return new AuthenticatedDataSource({ url })
                }
            },
        }),
    ],
})
export class GatewayModule {
}
