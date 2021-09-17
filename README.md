serverless-space

---

## Console

- url: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions
- login: jie.tian@live.cn

## Local development

```powershell
node_modules/.bin/serverless create -t aws-nodejs
node_modules/.bin/serverless config credentials --provider aws --key <key> --secret <secret>
node_modules/.bin/serverless deploy
curl https://jqp5j170i6.execute-api.us-east-1.amazonaws.com/dev/users/create
curl https://jqp5j170i6.execute-api.us-east-1.amazonaws.com/dev/api/
curl https://jqp5j170i6.execute-api.us-east-1.amazonaws.com/dev/nest/cats
curl https://jqp5j170i6.execute-api.us-east-1.amazonaws.com/dev/nest/graphql
```


## Deploy

Due to package size limitation, we have to run the following command to deploy: https://stackoverflow.com/a/69176517/769900

```shell
rm -rf node_modules && npm i --production
npm install -g serverless
npm install -g serverless-plugin-names

serverless deploy
```
