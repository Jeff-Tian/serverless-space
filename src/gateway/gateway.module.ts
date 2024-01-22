import {IntrospectAndCompose, LocalGraphQLDataSource} from '@apollo/gateway';
import {ApolloGatewayDriver, ApolloGatewayDriverConfig} from '@nestjs/apollo';
import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {AuthenticatedDataSource} from "./authenticated.data.source";
import getStrapiSchema from './strapi/strapi.service';

const allPossibleFederatableSubGraphs = [
    {name: 'orders', url: 'https://uni-orders-jeff-tian.cloud.okteto.net/graphql'},
    {name: 'face-swap', url: 'https://face-swap-jeff-tian.cloud.okteto.net/graphql'},
    {name: 'sls', url: 'https://zcjk76jr21.execute-api.us-east-1.amazonaws.com/stg/nest/graphql'},
    {
        name: 'user-service',
        url: 'https://brickverse-user-service-gracewen1.cloud.okteto.net/graphql'
    }
];

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            useFactory: async () => {
                const aliveGraphs = await Promise.all(allPossibleFederatableSubGraphs.map(async (graph) => {
                    try {
                        const response = await fetch(graph.url);
                        console.log(`Checking ${graph.url}...  ${response.status}`);
                        return response.status < 500 ? graph : null;
                    } catch (e) {
                        console.error(`Error when checking ${graph.url}`);
                        return null;
                    }
                })).then(graphs => graphs.filter(Boolean));

                let strapiSchema = null;
                try {
                    strapiSchema = await getStrapiSchema();
                } catch (e) {
                    console.error('Error when fetching strapi schema', e);
                    strapiSchema = null;
                }

                return ({
                    server: {
                        // ... Apollo server options
                        path: '/stg/gateway',
                    },
                    gateway: {
                        supergraphSdl: new IntrospectAndCompose({
                            subgraphs: aliveGraphs.concat(strapiSchema === null ? [] : [
                                {name: 'strapi', url: 'http://strapi'}
                            ]),
                            subgraphHealthCheck: false,
                        }),
                        buildService: ({name, url}) => {
                            if (url === 'http://strapi') {
                                return new LocalGraphQLDataSource(strapiSchema);
                            }

                            return new AuthenticatedDataSource({url})
                        }
                    },
                });
            },
        }),
    ],
})
export class GatewayModule {}
