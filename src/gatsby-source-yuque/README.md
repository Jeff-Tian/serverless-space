# gatsby-source-yuque

[![NPM version][npm-image]][npm-url]
[![LICENSE version][license-image]][license-url]

[npm-image]: https://img.shields.io/npm/v/gatsby-source-yuque.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/gatsby-source-yuque
[license-image]: https://img.shields.io/github/license/Raincal/gatsby-source-yuque.svg?style=flat-square
[license-url]: https://github.com/Raincal/gatsby-yuque/tree/master/packages/gatsby-source-yuque/LICENSE

Source plugin for pulling data into Gatsby from [语雀](https://www.yuque.com) API.

## Install

`npm install --save gatsby-source-yuque`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-source-yuque',
    options: {
      login: 'raincal',
      repo: 'blog',
      mdNameFormat: 'title'
    }
  }
]
```

## Options

| Name           | Default                         | Description                                                                 |
| -------------- | ------------------------------- | --------------------------------------------------------------------------- |
| `baseUrl`      | `https://www.yuque.com/api/v2/` | base url                                                                    |
| `login`        |                                 | user/team unique name                                                       |
| `repo`         |                                 | repo name                                                                   |
| `mdNameFormat` | `title`                         | `title` or `slug`                                                           |
| `timeout`      | `10000`                         | `timeout` specifies the number of milliseconds before the request times out |

## Query for all nodes

```graphql
{
  allYuqueDoc {
    edges {
      node {
        title
        slug
        cover
        description
        created_at
        childMarkdownRemark {
          html
        }
      }
    }
  }
}
```

## LICENSE

[MIT](https://github.com/Raincal/gatsby-yuque/tree/master/packages/gatsby-source-yuque/LICENSE)
