export default function getOrCreateHandler(server, bootstrap) {
    return async (event, context, callback) => {
        server = server ?? (await bootstrap());
        return server(event, context, callback);
    }
}