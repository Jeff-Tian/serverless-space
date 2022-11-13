import { Plugin } from '@nestjs/apollo';

import {
    ApolloServerPlugin,
} from 'apollo-server-plugin-base'

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
    async requestDidStart() {
        console.log('Request started')
        return {
            async willSendResponse(): Promise<void> {
                console.log('Will send response')
            },
        }
    }
}
