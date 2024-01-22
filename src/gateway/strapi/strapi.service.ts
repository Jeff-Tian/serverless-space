import {transformSchemaFederation} from "@jeff-tian/graphql-transform-federation";
import {print} from "graphql";
import {wrapSchema, introspectSchema} from "@graphql-tools/wrap";

const executor = async ({document, variables}) => {
    const query = print(document);
    const fetchResult = await fetch('https://strapi.brickverse.dev/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query, variables}),
    });

    return fetchResult.json();
}

export default async () => {
    const schemaFetched = await introspectSchema(executor);

    const schema = wrapSchema({
        schema: schemaFetched,
        executor,
    });

    console.log('schema = ', JSON.stringify(schema));
    const transformed = transformSchemaFederation(schema, {
        Query: {
            extend: true
        }
    })

    console.log('transformed = ', transformed);
    console.log('transformed = ', JSON.stringify(transformed));

    return transformed
}
