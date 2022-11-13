
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            server: {
                // ... Apollo server options
                cors: true,
                path: '/gateway'
            },
            gateway: {
                supergraphSdl: new IntrospectAndCompose({
                    subgraphs: [
                        { name: 'orders', url: 'https://uni-orders-jeff-tian.cloud.okteto.net/graphql' },
                    ],
                }),
            },
        }),
    ],
})
export class GatewayModule {}