import Vue from 'vue'
import {
    Button,
    Tabs,
    TabPane,
    Table,
    Message,
    Layout,
    Submenu,
    Icon,
    MenuItem,
    Content,
    Row,
    Col,
    Modal,
    FormItem,
    Card,
    Sider,
    Menu,
    Page,
    Form,
    Input,
    Select, Option, LoadingBar, DatePicker, CheckboxGroup, Checkbox, Header, Dropdown, DropdownMenu, DropdownItem,
} from "iview";
//引入iview样式文件
import 'iview/dist/styles/iview.css'
/* eslint-disable */
Vue.component('Button', Button)
Vue.component('Tabs', Tabs)
Vue.component('TabPane', TabPane)
Vue.component('Table', Table)
Vue.component('Form', Form)
Vue.component('Layout', Layout)
Vue.component('Submenu', Submenu)
Vue.component('Icon', Icon)
Vue.component('MenuItem', MenuItem)
Vue.component('Content', Content)
Vue.component('Row', Row)
Vue.component('Col', Col)
Vue.component('Modal', Modal)
Vue.component('Card', Card)
Vue.component('Sider', Sider)
Vue.component('Menu', Menu)
Vue.component('Page', Page)
Vue.component('FormItem', FormItem)
Vue.component('Input', Input)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('DatePicker', DatePicker)
Vue.component('CheckboxGroup', CheckboxGroup)
Vue.component('Checkbox', Checkbox)
Vue.component('Header', Header)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)

//全局注册消息组件
Vue.prototype.$Message = Message
//loading条
Vue.prototype.$LoadingBar = LoadingBar
//模态框
Vue.prototype.$Modal=Modal
