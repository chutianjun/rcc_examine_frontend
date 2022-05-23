import Mock from 'mockjs'

let List = []
export default {
    getStatisticaData: () => {
        for (let i = 0; i < 7; i++) {
            List.push(
                Mock.mock({
                    苹果: Mock.Random.float(100, 8000, 0, 0)
                })
            )
        }
        return {
            code: 200,
            data: {
                phoneData:List,
                videoData: [
                    {
                        name: '小米',
                        value: 2999,
                        salary:200,
                    },
                    {
                        name: 'vivo',
                        value: 23999,
                        salary:300,

                    },
                ]
            }
        }
    }
}
