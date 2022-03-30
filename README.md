# serverless-space

---

> My General SFF (Serverless for front-end).

![](https://pic1.zhimg.com/v2-783af5de059844bc4da647ce90a1b6f6_1440w.jpg?source=172ae18b)

## Online GraphQL Studio

- https://sls.pa-ca.me/nest/graphql


## Why

[一顿操作猛如虎，部署一个万能 BFF](https://zhuanlan.zhihu.com/p/412196725)

## Console

- url: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions
- login: jie.tian@live.cn

## Online development

https://jeff-tian-serverless-space-7j9qqgv3pwjx.github.dev/

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

## Run gatsby locally

```bash
yarn build && PORT=3000 node --experimental-modules dist/src/gatsby.js
```

## Run all offline 
```shell
yarn offline

open http://localhost:3000/dev/gatsby/graphql?query=%23%20Welcome%20to%20GraphiQL%0A%23%0A%23%20GraphiQL%20is%20an%20in-browser%20tool%20for%20writing%2C%20validating%2C%20and%0A%23%20testing%20GraphQL%20queries.%0A%23%0A%23%20Type%20queries%20into%20this%20side%20of%20the%20screen%2C%20and%20you%20will%20see%20intelligent%0A%23%20typeaheads%20aware%20of%20the%20current%20GraphQL%20type%20schema%20and%20live%20syntax%20and%0A%23%20validation%20errors%20highlighted%20within%20the%20text.%0A%23%0A%23%20GraphQL%20queries%20typically%20start%20with%20a%20%22%7B%22%20character.%20Lines%20that%20start%0A%23%20with%20a%20%23%20are%20ignored.%0A%23%0A%23%20An%20example%20GraphQL%20query%20might%20look%20like%3A%0A%23%0A%23%20%20%20%20%20%7B%0A%23%20%20%20%20%20%20%20field(arg%3A%20%22value%22)%20%7B%0A%23%20%20%20%20%20%20%20%20%20subField%0A%23%20%20%20%20%20%20%20%7D%0A%23%20%20%20%20%20%7D%0A%23%0A%23%20Keyboard%20shortcuts%3A%0A%23%0A%23%20%20Prettify%20Query%3A%20%20Shift-Ctrl-P%20(or%20press%20the%20prettify%20button%20above)%0A%23%0A%23%20%20%20%20%20Merge%20Query%3A%20%20Shift-Ctrl-M%20(or%20press%20the%20merge%20button%20above)%0A%23%0A%23%20%20%20%20%20%20%20Run%20Query%3A%20%20Ctrl-Enter%20(or%20press%20the%20play%20button%20above)%0A%23%0A%23%20%20%20Auto%20Complete%3A%20%20Ctrl-Space%20(or%20just%20start%20typing)%0A%23%0A%0A%0A%7B%0A%20%20allNPMScript%20%7B%0A%20%20%20%20nodes%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D
```


## Deploy

Due to package size limitation, we have to run the following command to deploy: https://stackoverflow.com/a/69176517/769900

```shell
rm -rf node_modules && npm i --production
npm install -g serverless
npm install -g serverless-plugin-names

yarn pre-deploy
# check size of node_modules, if size > 250M, then need to clean some unnecessary dependencies to reduce the size
du -h -d 0 layers/nodejs/node_modules | sort -h
serverless deploy
```
