import Mock from 'mockjs'
import homeApi from '@/api/mockSimulation/home'
//mock对 /home/getData 请求进行拦截,这个的作用 ,就是 不用后端返回 数据 ,前端 模拟数据,并且这个数据 不会走 网络请求
Mock.mock('/home/getData', homeApi.getStatisticaData())
