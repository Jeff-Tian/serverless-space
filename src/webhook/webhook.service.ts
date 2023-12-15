import {Injectable, Logger} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import util from "util";

function extractTextFromHTML(htmlString) {
    let inTag = false; // 指示是否在 HTML 标签内
    let inEntity = false; // 指示是否在 HTML 实体内
    let text = '';

    for (let i = 0; i < htmlString.length; i++) {
        const char = htmlString.charAt(i);

        if (char === '<') {
            inTag = true; // 进入标签
        } else if (char === '>') {
            inTag = false; // 退出标签
        } else if (char === '&') {
            inEntity = true; // 进入实体
        } else if (char === ';' && inEntity) {
            inEntity = false; // 退出实体
        } else if (!inTag && !inEntity) {
            text += char; // 如果不在标签和实体内，则将字符添加到文本中
        }
    }

    return text;
}

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);

    constructor(private readonly httpService: HttpService) {

    }

    async workflow(payload, target) {
        this.logger.log(`received payload to ${target}: `, payload);

        if (payload.event === 'entry.update') {
            try {
                const news = this.httpService.post(target, {
                    msgtype: 'news',
                    news: {
                        articles: [
                            {
                                title: payload.entry.Title,
                                description: extractTextFromHTML(payload.entry.Content),
                                url: 'https://taro.jefftian.dev/pages/subpages/brickverse/post?id=' + payload.entry.id,
                                picurl: 'https://brickverse-strapi-v2.s3.us-east-1.amazonaws.com/71018_Bag_Rocket_Boy_1_74727593ba_2c3e9235ad.png'
                            }
                        ]
                    }
                }).toPromise();
                const templateCard = this.httpService.post(target, {
                    msgtype: 'template_card',
                    template_card: {
                        "card_type": "news_notice",
                        "source": {
                            "icon_url": "https://brickverse-strapi-v2.s3.us-east-1.amazonaws.com/128x128_1ff90c7f30.jpg",
                            "desc": "brickverse",
                            "desc_color": 0
                        },
                        "main_title": {
                            "title": "有新的文章更新啦！",
                            "desc": "预览一下吧～"
                        },
                        "card_image": {
                            "url": 'https://brickverse-strapi-v2.s3.us-east-1.amazonaws.com/71018_Bag_Rocket_Boy_1_74727593ba_2c3e9235ad.png',
                            "aspect_ratio": 1.3
                        },
                        "image_text_area": {
                            "type": 1,
                            "url": 'https://taro.jefftian.dev/pages/subpages/brickverse/post?id=' + payload.entry.id,
                            "title": payload.entry.Title,
                            "desc": extractTextFromHTML(payload.entry.Content),
                            "image_url": 'https://brickverse-strapi-v2.s3.us-east-1.amazonaws.com/71018_Bag_Rocket_Boy_1_74727593ba_2c3e9235ad.png'
                        },
                        "quote_area": {
                            "type": 2,
                            "url": 'https://taro.jefftian.dev/pages/subpages/brickverse/post?id=' + payload.entry.id,
                            "appid": "wx8c777d630f2b78e3",
                            "pagepath": "pages/subpages/brickverse/post?id=" + payload.entry.id,
                            "title": "在小程序中预览",
                            "quote_text": extractTextFromHTML(payload.entry.Content.replace(/<br \/>/g, '\n')),
                        },
                        "jump_list": [
                            {
                                "type": 1,
                                "url": 'https://taro.jefftian.dev/pages/subpages/brickverse/post?id=' + payload.entry.id,
                                "title": "在网页中预览"
                            },
                            {
                                "type": 2,
                                "appid": "wx8c777d630f2b78e3",
                                "pagepath": "pages/subpages/brickverse/post?id=" + payload.entry.id,
                                "title": "打开小程序"
                            }
                        ],
                        "card_action": {
                            "type": 2,
                            "url": 'https://taro.jefftian.dev/pages/subpages/brickverse/post?id=' + payload.entry.id,
                            "appid": "wx8c777d630f2b78e3",
                            "pagepath": "pages/subpages/brickverse/post?id=" + payload.entry.id,
                        },
                    }
                }).toPromise();
                const results = await Promise.all([news, templateCard]);
                this.logger.log(`notification success: `, util.inspect(results[0].data), util.inspect(results[1].data));

                return results;
            } catch (ex) {
                console.error(ex);
                this.logger.error(`notification error: `, ex);

                return ex;
            }
        }

        return [payload, target];
    }
}
