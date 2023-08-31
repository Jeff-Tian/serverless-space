import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"

import {AppModule} from "../src/app.module"
import nock from "nock";

describe('iCloud', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it('parse download url from', async () => {
        nock('https://ckdatabasews.icloud.com.cn').post('/database/1/com.apple.cloudkit/production/public/records/resolve?ckjsBuildVersion=2310ProjectDev27&ckjsVersion=2.6.4&clientId=d3233a1b-f188-41a4-bd7f-507e05e826ac&clientBuildNumber=2317Hotfix55&clientMasteringNumber=2317Hotfix55', {"shortGUIDs": [{"value": "02aPe3Jgy3COgyPaWfUJPyfFw"}]}).reply(200, {
            "results": [
                {
                    "shortGUID": {
                        "value": "02aPe3Jgy3COgyPaWfUJPyfFw",
                        "shouldFetchRootRecord": true
                    },
                    "containerIdentifier": "com.apple.clouddocs",
                    "environment": "production",
                    "databaseScope": "SHARED",
                    "zoneID": {
                        "zoneName": "com.apple.CloudDocs",
                        "ownerRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                        "zoneType": "REGULAR_CUSTOM_ZONE"
                    },
                    "share": {
                        "recordName": "902FFE72-876C-47AE-9725-F89E94EAC84C",
                        "recordType": "cloudkit.share",
                        "fields": {
                            "cloudkit.title": {
                                "value": "movie_web",
                                "type": "STRING"
                            }
                        },
                        "pluginFields": {},
                        "recordChangeTag": "cx4",
                        "created": {
                            "timestamp": 1693276202235,
                            "userRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                            "deviceID": "1"
                        },
                        "modified": {
                            "timestamp": 1693276202235,
                            "userRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                            "deviceID": "iCloud"
                        },
                        "deleted": false,
                        "zoneID": {
                            "zoneName": "com.apple.CloudDocs",
                            "ownerRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                            "zoneType": "REGULAR_CUSTOM_ZONE"
                        },
                        "share": {
                            "recordName": "902FFE72-876C-47AE-9725-F89E94EAC84C",
                            "zoneID": {
                                "zoneName": "com.apple.CloudDocs",
                                "ownerRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                                "zoneType": "REGULAR_CUSTOM_ZONE"
                            }
                        },
                        "publicPermission": "READ_ONLY",
                        "participants": [
                            {
                                "participantId": "96d0d895-2836-3d76-9caa-04e79be0abe4",
                                "userIdentity": {
                                    "userRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                                    "nameComponents": {
                                        "givenName": "杰",
                                        "familyName": "田"
                                    },
                                    "lookupInfo": {
                                        "emailAddress": "jie.tian@hotmail.com"
                                    }
                                },
                                "type": "OWNER",
                                "acceptanceStatus": "ACCEPTED",
                                "permission": "READ_WRITE",
                                "orgUser": false,
                                "publicKeyVersion": 1,
                                "outOfNetworkPrivateKey": "",
                                "outOfNetworkKeyType": 0,
                                "protectionInfo": {
                                    "bytes": "",
                                    "pcsChangeTag": ""
                                }
                            }
                        ],
                        "owner": {
                            "participantId": "96d0d895-2836-3d76-9caa-04e79be0abe4",
                            "userIdentity": {
                                "userRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                                "nameComponents": {
                                    "givenName": "杰",
                                    "familyName": "田"
                                },
                                "lookupInfo": {
                                    "emailAddress": "jie.tian@hotmail.com"
                                }
                            },
                            "type": "OWNER",
                            "acceptanceStatus": "ACCEPTED",
                            "permission": "READ_WRITE",
                            "orgUser": false,
                            "publicKeyVersion": 1,
                            "outOfNetworkPrivateKey": "",
                            "outOfNetworkKeyType": 0,
                            "protectionInfo": {
                                "bytes": "",
                                "pcsChangeTag": ""
                            }
                        },
                        "invitedPCS": {
                            "bytes": "YYIDWDCCA1QwggGKAgEBMYIBgzB/MCUCAQAEIIyhQbtgeE6yISxEIDn6lDhpqUTFxXbmMGOLSQrFnwI2BFMBAGNBhPQr8VlkzRTztNC8UkeXAzpyWxVMPXblC0h2YVpAMLSirOWoCWJ954xeauB8zAWMsg9BsPZiglbm58WHxxWlTCCg/mLzq8E4a57eN4oTOQIBADB/MCUCAQAEIJwj9ag2zwtUxAwuNE5dHIJDcJB7xpt/MEni8hjKW+o2BFMBALxgB+wFbPcdm1lUH1fLi0mufkNqdfyHnQdQTim1gWBVMAt4VjL1FD1h3EnCDY3qrj3dzaBnvLAuLbIxrRbj8voOGfaj6btQD5yjSB5yGGcYHQIBATB/MCUCAQAEIOh6cqenZ1iamal2+dGaV7QyNGSvZ6PmK/BxrMGGV8j0BFMBAAW7geqnelyHt1ZmyTLq51Ymnr/qH7RgLm8MjZ5ZqkkRMK4q2XQfrbK4suZO3bPhkTwtsZJ8v/zp0qf9f+16HEBXbSxGdY37Jaj33VyseNdfrgIBAKCBqASBpQMBFALSBkbEhdRs1KHlJmXZlLC6IC/E3khiUB3QMkGygh6L7E98s/6SXf7XGF3LhMv2VkfNP6S36ilJvoGbJPqXNH73Gxlq0EreywCA+bzC6Vn8x0jcbpAw8XwuKVv4N03DR4hcIZU2CQkaWW4jwgYpnA1z5YV+1u5SCImB1j8aYsu/J5qsUyIHtWabcbDCJYENyFOBBOAT5XHQIH5sAjE5PqNqK6GB7jCB6wIBBASB5TCB4gIBAQIBADBGAgEBBEEEVNiSGtGcULWPugpbu84fwGEx3OZIkRpTxa0nBdAjjbHZiriFc4OC4+TrO4vWKwld3ADEU4IbZGVxXIsldpLTTzBiBBSJlxr8D6MJTSIwVRMlcw/H4p+xWwIBAQRHMEUCIQDNa6m88vauJeN10Ai54qCqPesGbQaoDGFTsM8TSkcqOAIgUbWfuAkXtZRvzVuJ3addoYJ2d6kOd8fVxEwWqOo1T8GgAwIBAKIpMCcwJQIBAwQgYkdh16FE163YVpQNmyxXF5z7TJDxGaDHHZpxW6NIQxMEINzHv4K2TLarQawijGcgcqJ9G0CxgXKV5D2liUH1cgKYogYEBAEU0gY=",
                            "pcsChangeTag": "239228891254241C514CB2A65FAAD1EEB7EA7132"
                        },
                        "selfAddedPCS": {
                            "bytes": "YYID2TCCA9UwggILAgEBMYICBDB/MCUCAQAEIGJHYdehRNet2FaUDZssVxec+0yQ8Rmgxx2acVujSEMTBFMBANplmhFvL1vrWhTtPjW4EMuK7H/Lh3t71QC7X1afCL0YMJZSL8NA8SEqt4PWecwTFXZxgBJHBrchBKxaFsVrxxr3eypdXv9/IfgcKcL1u14j2wIBADB/MCUCAQAEIIyhQbtgeE6yISxEIDn6lDhpqUTFxXbmMGOLSQrFnwI2BFMBAFHCiOCcQifSvVmigJDf4KLZGUj84klZTfkLNxRjMAebMCFFP3n2oxwtsRX73ZeZWYBcZ1wQwJe/a8gpFtnMVJboNQhinQ9t+/LHve2VaUaR+gIBADB/MCUCAQAEIJwj9ag2zwtUxAwuNE5dHIJDcJB7xpt/MEni8hjKW+o2BFMBADnk9vpkppE96Q1P9ViRSxJrUsVCw+Xz+k0HLtotgp8pML1qF5BHkqeK0roBLiizFLzmYZRsp3H5R4/UA3BubETeIpUiJca9qRZObELH2kh7GQIBADB/MCUCAQAEIOh6cqenZ1iamal2+dGaV7QyNGSvZ6PmK/BxrMGGV8j0BFMBALCO5f64qAknJ/8y/S0OhFTGvh2oXCiBn6FGKRAhmJYtMNlXAEgrs9XTMWoTeU8M/HKqFIVJ1jw/VX6lg3bMU8ZFxR0IUt9rwta4uZQIpH4y3AIBAKCBqASBpQP1zAL/qrSsE6rbspEa2SVXWndYBXcEvgxz6RKf83/ZThKLRhsagF8JAk49UkIWzoqxrYM+MY+dVYTPwacsEtVw/UdT4nz2AVf6mJ8ICLXqUrcSzUWv/mYyD+y8l1vl9IzTcKQXSH2xzsKy4/Wusij/oE9kP1riTBAullWs9qXcVupYs40IP8BCIge0mk1BxU24SYVaQQuyFuTYv/MORM/P4k51dqGB7jCB6wIBBASB5TCB4gIBAQIBADBGAgEBBEEEGm2Sd9uN35PAgSksoUYhGaotbZun4fkqCzcsWBEJqHjyxZsKTyJ+gVOi7AI9bExtBBpFJ06qPX0/ntxmiPYLAjBiBBQxtz2XOQ40GsJPn9VXIIhexjEpjAIBAQRHMEUCIGvywUQuXPrW6GQVVgW57HbPcPFqZLRWkyKX7GlhRD/PAiEA5Vr81wZ0AIlt0QJGPS/2BFZIb6hlPr4trW4rfhKlwYWgAwIBAKIpMCcwJQIBAwQgnCP1qDbPC1TEDC40Tl0cgkNwkHvGm38wSeLyGMpb6jYEIMvSOUnAqpUo5wrHi7Ljxib/Br56IzjGIyd6I2qTjB5TogYEBPXM/6o=",
                            "pcsChangeTag": "937D44098ED80FEF9FB497F6775E26293108F84A"
                        },
                        "shortTokenHash": "iq7Ve0q0hTr7fyiCvgtu9l89TqPuRdCbJlm9QVoQNo4=",
                        "shortGUID": "02aPe3Jgy3COgyPaWfUJPyfFw"
                    },
                    "rootRecordName": "documentContent/902FFE72-876C-47AE-9725-F89E94EAC84C",
                    "rootRecord": {
                        "recordName": "documentContent/902FFE72-876C-47AE-9725-F89E94EAC84C",
                        "recordType": "content",
                        "fields": {
                            "lastEditorName": {
                                "value": "{\"ckUserId\":\"_6a19e3cd7a2f93e58bc883e2616f54e8\",\"name\":{\"last\":\"田\",\"first\":\"杰\"},\"type\":\"user\"}",
                                "type": "STRING"
                            },
                            "extension": {
                                "value": "mp4",
                                "type": "STRING"
                            },
                            "basehash": {
                                "value": "57v0bcL0ky0jkQK5vdyxSuCGIa1POVlB3q9zcdeRYO8=",
                                "type": "BYTES"
                            },
                            "size": {
                                "value": 8200859,
                                "type": "NUMBER_INT64"
                            },
                            "encryptedBasename": {
                                "value": "bW92aWVfd2Vi",
                                "type": "ENCRYPTED_BYTES"
                            },
                            "thumb1024": {
                                "value": {
                                    "fileChecksum": "AZrABAdOEON4l5zTpsm/h/NH7tXc",
                                    "size": 19476,
                                    "wrappingKey": "txiiihXE5i6mjvxfW+SnVw==",
                                    "referenceChecksum": "AZTHxtmJ1pJPXub6ZO04/L+tKuAi",
                                    "downloadURL": "https://cvws.icloud-content.com.cn/B/AZrABAdOEON4l5zTpsm_h_NH7tXcAZTHxtmJ1pJPXub6ZO04_L-tKuAi/${f}?o=AkLZ0UUT3qGdJ5RSTdDbuHbq94gy0I9E73gRw0dnAWC9&v=1&x=3&a=CAogMXxzBmegrZHVrfbkNselUixgvFTw0z8Wv5xkWT6hDcsSbRCp0NiJpDEYqa20i6QxIgEAUgRH7tXcWgStKuAiaiZrWPjHk8kgB5RfKZQmlUYy_JVyePHQ2AfaVIl1uzNGSLhIG8ymMXImfzeU4vyiKj4xHGhb4Vv1s-kX6qs8_hpEmrKSczEsF29O8FVzQ1Y&e=1693314782&fl=&r=91e8aba8-12d8-4bfc-8456-00f633c74d02-1&k=txiiihXE5i6mjvxfW-SnVw&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=220&s=WekQTSvmWCOsmKwFHd7_XLjXTYE"
                                },
                                "type": "ASSETID"
                            },
                            "quarantine": {
                                "value": "cS8wMDgxOzY0N2RjMGJjO0Nocm9tZTsA",
                                "type": "ENCRYPTED_BYTES"
                            },
                            "mtime": {
                                "value": 1685962941,
                                "type": "NUMBER_INT64"
                            },
                            "thumbQLMetadata": {
                                "value": "YnBsaXN0MDDTAQIDBBMUXxAjUUxUaHVtYm5haWxNZXRhZGF0YUZpbGVWZXJzaW9uS2V5LjJfECZRTFRodW1ibmFpbE1ldGFkYXRhTWF4aW11bURpbWVuc2lvbktleV8QKVFMVGh1bWJuYWlsTWV0YWRhdGFGaWxlTmFtZXNEaWN0aW9uYXJ5S2V51wUGBwgJCgsMDQ4PEBESUWdSZ1ZSbURRaVFlUnZJUXNfEBljb20uYXBwbGUuTW9iaWxlUXVpY2tMb29rUTEzQcUW/B63/LoSAcO4N1NtcDRPEJZicGxpc3QwMNQBAgMEBQYHClgkdmVyc2lvblkkYXJjaGl2ZXJUJHRvcFgkb2JqZWN0cxIAAYagXxAPTlNLZXllZEFyY2hpdmVy0QgJVHJvb3SAAaILDFUkbnVsbEw3uMMBAAAAAPoBAAAIERokKTI3SUxRU1ZcAAAAAAAAAQEAAAAAAAAADQAAAAAAAAAAAAAAAAAAAGkSAH0imyNAkAAAAAAAANEVFl8QG05TVGh1bWJuYWlsMTAyNHgxMDI0U2l6ZUtleV50aHVtYm5haWwuanBlZwAIAA8ANQBeAIoAmQCbAJ4AoQCjAKUAqACqAMYAyADRANYA2gFzAXgBgQGEAaIAAAAAAAACAQAAAAAAAAAXAAAAAAAAAAAAAAAAAAABsQ==",
                                "type": "BYTES"
                            },
                            "fileContent": {
                                "value": {
                                    "fileChecksum": "AaU3WcSjEzk6SflDS9BJ7yCQkiJQ",
                                    "size": 8200859,
                                    "wrappingKey": "EriN/hG224uaueW2AfCypQ==",
                                    "referenceChecksum": "AQh3tBrAlf6p8vLiS5/i4WR5x2ug",
                                    "downloadURL": "https://cvws.icloud-content.com.cn/B/AaU3WcSjEzk6SflDS9BJ7yCQkiJQAQh3tBrAlf6p8vLiS5_i4WR5x2ug/${f}?o=ApAt11YqMLAtOW6EmZKdOoYmN6jG9d-CtMg-xgcpwU5S&v=1&x=3&a=CAogb3fiRmpMUbhxJrH8ENFtxNJwwD-Eiv0BDF7R8xZtxeoSbRCq0NiJpDEYqq20i6QxIgEAUgSQkiJQWgR5x2ugaiZfY9FNKyRXACAnah0kSgbk0V6xIovVSFP6LLVfXsBnqjyLJOkjgnImb03lX_ErGUnnnrr4s1K0q6BsQZQVlbcaHH1f21BpCjSRv8ajpn0&e=1693314782&fl=&r=91e8aba8-12d8-4bfc-8456-00f633c74d02-1&k=EriN_hG224uaueW2AfCypQ&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=220&s=FpaPVNI7Pr1PWLQcgrkGQ8dg8Rs"
                                },
                                "type": "ASSETID"
                            },
                            "publicSharingPermission": {
                                "value": 2,
                                "type": "NUMBER_INT64"
                            }
                        },
                        "pluginFields": {
                            "br_driveAppContainer": {
                                "value": "com.apple.CloudDocs",
                                "type": "STRING"
                            }
                        },
                        "recordChangeTag": "cx5",
                        "created": {
                            "timestamp": 1693276098276,
                            "userRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                            "deviceID": "1"
                        },
                        "modified": {
                            "timestamp": 1693276202238,
                            "userRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                            "deviceID": "iCloud"
                        },
                        "deleted": false,
                        "share": {
                            "recordName": "902FFE72-876C-47AE-9725-F89E94EAC84C",
                            "zoneID": {
                                "zoneName": "com.apple.CloudDocs",
                                "ownerRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                                "zoneType": "REGULAR_CUSTOM_ZONE"
                            }
                        },
                        "displayedHostname": "www.icloud.com.cn",
                        "stableUrl": {
                            "routingKey": "02a",
                            "shortTokenHash": "iq7Ve0q0hTr7fyiCvgtu9l89TqPuRdCbJlm9QVoQNo4=",
                            "protectedFullToken": "",
                            "encryptedPublicSharingKey": "A87CAuWaegu/GFkvXKykUgxBkRkifXOjwRRGUKeNOapaYo5pvbUdxgObI4wgLrFdqqCaFtkLfVGi6i+x3B2XYqpbLQYO",
                            "displayedHostname": "www.icloud.com.cn"
                        },
                        "shortGUID": "02aPe3Jgy3COgyPaWfUJPyfFw"
                    },
                    "ancestorRecords": [],
                    "ownerIdentity": {
                        "userRecordName": "_6a19e3cd7a2f93e58bc883e2616f54e8",
                        "nameComponents": {
                            "givenName": "杰",
                            "familyName": "田"
                        },
                        "lookupInfo": {
                            "emailAddress": "jie.tian@hotmail.com"
                        }
                    },
                    "potentialMatchList": []
                }
            ]
        })

        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `query queryDownloadUrl {
                downloadUrlOfICloudSharing(shortGUID: "02aPe3Jgy3COgyPaWfUJPyfFw") {
                    downloadURL
                }
            }`
            })
            .expect({
                data: {
                    downloadUrlOfICloudSharing: {
                        downloadURL: 'https://cvws.icloud-content.com.cn/B/AaU3WcSjEzk6SflDS9BJ7yCQkiJQAQh3tBrAlf6p8vLiS5_i4WR5x2ug/${f}?o=ApAt11YqMLAtOW6EmZKdOoYmN6jG9d-CtMg-xgcpwU5S&v=1&x=3&a=CAogb3fiRmpMUbhxJrH8ENFtxNJwwD-Eiv0BDF7R8xZtxeoSbRCq0NiJpDEYqq20i6QxIgEAUgSQkiJQWgR5x2ugaiZfY9FNKyRXACAnah0kSgbk0V6xIovVSFP6LLVfXsBnqjyLJOkjgnImb03lX_ErGUnnnrr4s1K0q6BsQZQVlbcaHH1f21BpCjSRv8ajpn0&e=1693314782&fl=&r=91e8aba8-12d8-4bfc-8456-00f633c74d02-1&k=EriN_hG224uaueW2AfCypQ&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=220&s=FpaPVNI7Pr1PWLQcgrkGQ8dg8Rs'
                    }
                }
            })
            .expect(200)
    })
})
