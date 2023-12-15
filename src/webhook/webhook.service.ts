import {Injectable, Logger} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);

    constructor(private readonly httpService: HttpService) {

    }

    async workflow(payload, target) {
        this.logger.log(`received payload to ${target}: `, payload);

        if (payload.event === 'entry.update') {
            try {
                const {data} = await this.httpService.post(target, {
                    msgtype: 'news',
                    news: {
                        articles: [
                            {
                                title: payload.entry.Title,
                                description: payload.entry.Content,
                                url: 'https://taro.jefftian.dev/pages/subpages/brickverse/post?id=' + payload.entry.id,
                                picurl: 'https://brickverse-strapi-v2.s3.us-east-1.amazonaws.com/71018_Bag_Rocket_Boy_1_74727593ba_2c3e9235ad.png'
                            }
                        ]
                    }
                }).toPromise()
                this.logger.log(`notification success: `, data);

                return data;
            } catch (ex) {
                console.error(ex);
                this.logger.error(`notification error: `, ex);

                return ex;
            }
        }

        return [payload, target];
    }
}
