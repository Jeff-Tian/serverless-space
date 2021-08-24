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
```
