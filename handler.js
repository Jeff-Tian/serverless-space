'use strict';
const handler = require('serverless-express/handler')
const app = require('./index.js')
const mp = require('./wechat/mp')

module.exports.api = handler(app)

module.exports.hello = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.consumer = async (event) => {
    console.log('consuming ', event);

    for (const record of event.Records) {
        const messageAttributes = record.messageAttributes;
        console.log(
            "Message Attribute: ",
            messageAttributes.AttributeName.stringValue
        );
        console.log("Message Body: ", typeof record.body, ' ', record.body);

        if (typeof record.body === 'string') {
            record.body = JSON.parse(record.body);
        }

        const slug = record.body.data.slug;
        const title = record.body.data.title;
        const content = record.body.data.body_html;
        const markdownContent = record.body.data.body;

        const res = await mp.addDrafts({
            title,
            html: content,
            markdown: markdownContent,
            content_source_url: `https://jeff-tian.jiwai.win/posts/${slug}/`,
            mini_program_path: `pages/yuque/article?slug=${slug}`,
        });
        console.log('add draft res = ', res.map(x => x.data));
    }

    console.log('consumed event');
}
