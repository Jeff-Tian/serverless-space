export const curlirize = (config) => {
    const headers = config.headers.common ?? config.headers

    const serializedHeaders = Object.keys(headers).map((key) => `--header "${key}: ${headers[key]}"`)

    const cmd = `cURL to replay: curl -X ${config.method} "${config.url}" ${serializedHeaders.join(' ')} `

    if (config.data) {
        return cmd + `--data '${JSON.stringify(config.data)}'`
    } else {
        return cmd
    }
}
