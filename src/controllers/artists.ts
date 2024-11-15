import { Router, Request, Response } from "express";

const router = Router()

router.get('/artists', (req: Request, res: Response) => {
    res.send({
        "data": [
            {
                "id": "9c37923b-afb6-46fa-b79d-09f01672a83f",
                "name": "Tears For Fears",
                "bio": "Tears for Fears are an English pop rock band formed in Bath in 1981 by Curt Smith and Roland Orzabal. Founded after the dissolution of their first band, the mod-influenced Graduate, Tears for Fears were associated with the synth-pop bands of the 1980s, and attained international chart success as part of the Second British Invasion.",
                "artistBannerImagePath": "https://placehold.co/400",
                "albums": [
                    {
                        "id": "839029eb-34b8-48ea-9966-9164013b6519",
                        "title": "Songs From The Big Chair",
                        "releaseDate": "1985-02-25",
                        "albumArtPath": "https://placehold.co/400",
                        "genres": [
                            {
                                "id": "73b6ce17-e649-4136-ba11-19706d3bf8b4",
                                "name": "Pop"
                            },
                            {
                                "id": "493696ce-ba2a-4dab-b5ae-f257b04da74f",
                                "name": "New Wave"
                            }
                        ],
                        "tracks": [
                            {
                                "id": "7f93771b-525f-4988-a65a-ea5363ba30b6",
                                "position": 1,
                                "title": "Shout",
                                "duration": 392,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "ff489561-cfef-4f5e-b991-265409adadab",
                                "position": 2,
                                "title": "The Working Hour",
                                "duration": 391,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "62f728e1-60ec-4fea-8c34-1cee1ef8a81d",
                                "position": 3,
                                "title": "Everybody Wants to Rule The World",
                                "duration": 255,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "b3c5603c-4ae9-43c9-a03f-df4c9be01bd4",
                                "position": 4,
                                "title": "Mothers Talk",
                                "duration": 306,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "b2de62c5-8248-4ca0-b81d-2974fe0c2f22",
                                "position": 5,
                                "title": "I Believe",
                                "duration": 295,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "218894a6-2ace-4c56-84c8-fe38ecccdcab",
                                "position": 6,
                                "title": "Broken",
                                "duration": 158,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "36d5571f-e644-4963-b408-46d722ccec24",
                                "position": 7,
                                "title": "Head Over Heels",
                                "duration": 302,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "2d5fb0a3-90f0-488d-acd8-e70a4d1338c6",
                                "position": 8,
                                "title": "Listen",
                                "duration": 413,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            }
                        ]
                    },
                    {
                        "id": "839029eb-34b8-48ea-9966-9164013b6518",
                        "title": "The Seeds Of Love",
                        "releaseDate": "1989-09-25",
                        "albumArtPath": "https://placehold.co/400",
                        "genres": [
                            {
                                "id": "73b6ce17-e649-4136-ba11-19706d3bf8b4",
                                "name": "Pop"
                            },
                            {
                                "id": "493696ce-ba2a-4dab-b5ae-f257b04da74f",
                                "name": "New Wave"
                            }
                        ],
                        "tracks": [
                            {
                                "id": "7f93771b-525f-4988-a65a-ea5363ba30b6",
                                "position": 1,
                                "title": "Woman In Chains",
                                "duration": 391,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            },
                            {
                                "id": "ff489561-cfef-4f5e-b991-265409adadab",
                                "position": 2,
                                "title": "Bad Man's Song",
                                "duration": 512,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            },
                            {
                                "id": "62f728e1-60ec-4fea-8c34-1cee1ef8a81d",
                                "position": 3,
                                "title": "Sowing The Seeds Of Love",
                                "duration": 379,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            },
                            {
                                "id": "b3c5603c-4ae9-43c9-a03f-df4c9be01bd4",
                                "position": 4,
                                "title": "Advice For The Young At Heart",
                                "duration": 290,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            },
                            {
                                "id": "b2de62c5-8248-4ca0-b81d-2974fe0c2f22",
                                "position": 5,
                                "title": "Standing On The Corner of the Third World",
                                "duration": 333,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            },
                            {
                                "id": "218894a6-2ace-4c56-84c8-fe38ecccdcab",
                                "position": 6,
                                "title": "Swords and Knives",
                                "duration": 373,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            },
                            {
                                "id": "36d5571f-e644-4963-b408-46d722ccec24",
                                "position": 7,
                                "title": "Year Of The Knife",
                                "duration": 428,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            },
                            {
                                "id": "2d5fb0a3-90f0-488d-acd8-e70a4d1338c6",
                                "position": 8,
                                "title": "Famous Last Words",
                                "duration": 391,
                                "filePath": "",
                                "format": {
                                    "id": "afbc7168-275f-4f01-a883-1618105a66d2",
                                    "name": "MP3"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "id": "fda75a3e-ed06-435c-b998-113a31fa04ec",
                "name": "Dave Hause",
                "bio": "Dave Hause (born March 12, 1978) is an American singer-songwriter. He currently performs both solo and with his band The Mermaid. His music draws from heartland rock, folk rock and punk rock. He has also played in multiple Philadelphia-area punk and hardcore bands, including The Loved Ones and The Falcon.",
                "artistBannerImagePath": "https://placehold.co/400",
                "albums": [
                    {
                        "id": "cdd2ec5b-b393-4cb5-8e73-b1a397928b9f",
                        "title": "Drive It Like It's Stolen",
                        "releaseDate": "2023-04-28",
                        "albumArtPath": "https://placehold.co/400",
                        "genres": [
                            {
                                "id": "b4e6fc8e-7a56-42bc-92f6-e9b9034f9412",
                                "name": "Americana"
                            },
                            {
                                "id": "20b15f38-b907-4900-a6b4-6092a36abb88",
                                "name": "Rock"
                            }
                        ],
                        "tracks": [
                            {
                                "id": "7f93771b-525f-4988-a65a-ea5363ba30b6",
                                "position": 1,
                                "title": "Cheap Seats (New Years Day, NYC, 2024)",
                                "duration": 201,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "ab4c9581-08ac-4e75-9f96-7788a60e0748",
                                "position": 2,
                                "title": "Pedal Down",
                                "duration": 210,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "f7b60bac-3232-4e38-b3d4-96261e48586d",
                                "position": 3,
                                "title": "Damn Personal",
                                "duration": 186,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "167385ec-f01b-44b6-b1c1-f4a4a1a20cee",
                                "position": 4,
                                "title": "Low",
                                "duration": 306,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "22c69cdc-b32e-4e8f-952a-c7485c54921a",
                                "position": 5,
                                "title": "Chainsaweyes",
                                "duration": 155,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "35975694-f81d-48e6-b385-8a891693ba84",
                                "position": 6,
                                "title": "Hazard Lights",
                                "duration": 172,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "36d5571f-e644-4963-b408-46d722ccec24",
                                "position": 7,
                                "title": "Drive It Like It's Stolen",
                                "duration": 302,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "0d7573bf-747f-4996-8597-601613f0867f",
                                "position": 8,
                                "title": "Lashing Out",
                                "duration": 173,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "e6a6c457-b835-4308-a3a8-57361c04bee2",
                                "position": 9,
                                "title": "Tarnish",
                                "duration": 175,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            },
                            {
                                "id": "f5e73cd2-29f9-499c-ad4c-554d2b991014",
                                "position": 10,
                                "title": "The Vulture",
                                "duration": 190,
                                "filePath": "",
                                "format": {
                                    "id": "467b6182-8920-45cf-b1d2-09fc6d9e9bcc",
                                    "name": "FLAC"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    });
});


export default router;