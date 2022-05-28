<template>
  <div id="company_list">


    <Card style="width:100%">
      <h3 slot="title">
        <Icon type="ios-film-outline"></Icon>
        <span :style="{'margin-left':'5px','vertical-align':'middle'}">公司列表</span>
      </h3>

      <template #extra>

      </template>

      <div id="content-div">

        <Col span="24" :style="{'margin-bottom':'10px'}">
          <Button class="but-left" @click="addCompany" :size="'large'" icon="md-add" type="primary" ghost>添加公司
          </Button>
          <Button class="but-left" :size="'large'" icon="ios-sync" type="default" @click="flushCompany">刷新</Button>
        </Col>

        <!--        列表-->
        <Table
            @on-row-click="rowClick"
            stripe border ref="selection" :columns="tableData.columns" :data="tableData.data">

          <template #action="{row}">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editCompany(row)">编辑</Button>
            <Button type="error" size="small" @click="removeCompany(row)">删除</Button>
          </template>

        </Table>

        <!--       分页 -->

        <Row :style="{display: 'flex','margin-top':'20px'}">
          <Col span="20">
            <Page
                :current="searchParams.page"
                 @on-page-size-change="pageSizeChange"
                  @on-change="jumpPage"
                  :page-size="searchParams.per_page"
                  :total="dataTotal"
                  show-total
                  show-elevator
                  show-sizer></Page>
          </Col>

          <Col span="4">
            <!--            <div class="selectButton">-->
            <!--              <Button @click="handleSelectAll(true)" class="selectitem">全选</Button>-->
            <!--              <Button @click="handleSelectAll(false)" class="selectitem">取消全选</Button>-->
            <!--            </div>-->
          </Col>
        </Row>

      </div>

    </Card>


    <!--    弹出框 s-->
    <!--    弹出框-->
    <Modal
        width="600"
        id="company-modal"
        :footer-hide="true"
        ref="companyRef"
        :mask-closable="false"
        v-model="companyModalShow"
        title="添加公司"
    >

      <Form ref="companyForm" :model="companyFormData" :rules="companyRuleValidate" :label-width="80"
            id="company_form">
        <Row>

          <Col span="12">
            <FormItem label="公司名称" prop="company_name">
              <Input v-model="companyFormData.company_name" placeholder="请输入公司名称"></Input>
            </FormItem>

          </Col>

          <Col span="12">
            <FormItem label="公司电话" prop="company_phone">
              <Input v-model="companyFormData.company_phone" placeholder="请输入公司名称"></Input>
            </FormItem>

          </Col>

          <Col span="12">
            <FormItem label="公司邮编" prop="company_postcode">
              <Input v-model="companyFormData.company_postcode" placeholder="请输入公司邮编"></Input>
            </FormItem>

          </Col>

          <Col span="12">
            <FormItem label="公司地址" prop="company_address">
              <Input v-model="companyFormData.company_address" placeholder="请输入公司地址"></Input>
            </FormItem>
          </Col>

          <!--          跟进人s-->
          <Col span="12">
            <FormItem label="跟进人" prop="followup_employee_id">
              <Select v-model="companyFormData.followup_employee_id" placeholder="请选择跟进人">
                <template v-for="item in employeeList">
                  <Option :value="item.id" :key="item.id">
                    {{ item.employee_name }}
                  </Option>
                </template>
              </Select>
            </FormItem>
          </Col>
          <!--          跟进人e-->

          <Col span="24" style="text-align: right">
            <FormItem>
              <Button type="primary" :loading="companySubmitLoading" @click="companyHandleSubmit('companyForm')">
                <span v-if="!companySubmitLoading">
                  {{ opearCompanyStatus == 'create' ? '新增公司' : '修改公司' }}
                </span>
                <span v-else>处理中...</span>
              </Button>
              <Button @click="companyHandleReset('FollowForm')" style="margin-left: 8px">重置</Button>
            </FormItem>

          </Col>

        </Row>

      </Form>
      <!--      自定义页脚-->
      <!--      <div slot="footer"></div>-->
    </Modal>
    <!--    弹出框 e-->

  </div>
</template>

<script>
//引入接口文件
import {
  companyList,
  postDelCompany,
  getAllEmployee,
  postEditFollow,
} from "@/api/realRequest/v1/company";
import _ from "lodash";
import {getCompanyDetail, postAddCompany, postEditCompany} from "@/api/realRequest/v1/company/opear";
//原始公司数据
const originCompanyForm = {
  company_name: "",
  company_phone: "",
  company_postcode: "",
  company_address: "", //公司地址
  followup_employee_id: "", //跟进人
  company_id: '' //公司ID
};
//默认搜索项
const searchParams={
  page: 1,
  per_page: 10,
  company_name: '',//公司名称搜索
  followup_employee_id: '',//员工id搜索
}

export default {
  name: "companyList",
  data() {
    //保留 当前的this,也就是当前vue 实例
    let this_v = this;
    return {
      dataTotal:0,//数据局总数
      isLoading: false,//全屏的loading
      companySubmitLoading: false,
      companyRuleValidate: { //表单校验规则
        company_name: [
          {required: true, message: '请填写公司名称', trigger: 'blur,change'},
        ],
      },
      //公司input数据
      companyFormData: {},
      //modal框
      companyModalShow: false,
      opearCompanyStatus: 'create', //默认创建公司
      employeeList: [], //员工列表
      tableData: {
        //表格表头
        columns: [
          // 多选框
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '公司名称',
            key: 'company_name',
            align: 'center',
            // eslint-disable-next-line no-unused-vars
            render(h, params) {  //自定义 表格 中的内容 ,这里都是 按列 来 渲染
              return h('a', {
                attrs: {
                  href: '/company/detail?company_id=' + params.row.id,
                },
                on: {
                  click: () => {
                    // console.log(params.row.company_name)
                  }
                }
              }, params.row.company_name)
            },
            renderHeader(h, params) //自定义表头
            {
              return h('Input', {
                attrs: {
                  id: 'search_input',
                  placeholder: '公司名称',
                },
                props: {
                  clearable: true,
                  value: this_v.searchParams.company_name  // 类似于使用v-bind将data选项中的value变量绑定到input的value属性上
                },
                //iview 组件 的事件,要用on
                on: {
                  "on-clear": () => {
                    this_v.companySearch('', params)
                  }
                },
                //原生的事件,用nativeOn
                nativeOn: {
                  // click(event){
                  // this_v.companyNameSearch(event,params)
                  // },
                  keyup(event) {
                    if (event.keyCode == 13) {
                      this_v.companySearch(event.target.value, params)
                    }
                  },
                  // click: (event) => {
                  // console.log(this)
                  // console.log(params.column)
                  // }
                }
              }, '公司名称')
            }
          },
          {
            title: '跟进人',
            key: 'follow_up_employee_name',
            align: 'center',
            renderHeader(h, params) //自定义表头
            {
              //方式1. 先遍历出 结果再 赋值
              // let employee_options=[],
              //     i=0;
              // this_v.employeeList.map(item=>{
              //   employee_options[i]=h('Option',{
              //     props: {
              //       value: item.id
              //     }
              //   },item.employee_name)
              //   i++;
              // })
              return h('Select', {
                    attrs: {
                      style: "width:150px",
                      placeholder: '跟进人',
                    },
                    props: {
                      //实现双向绑定
                      value: this_v.searchParams.followup_employee_id,  // 类似于使用v-bind将data选项中的value变量绑定到input的value属性上
                      filterable: true,//可搜索
                      transfer: true, //是否将弹层放置于 body 内
                      clearable: true, //清空按钮
                    },
                    //iview 组件 的事件,要用on
                    on: {
                      'on-change': (value) => {
                        this_v.companySearch(value, params)
                      },
                      "on-clear": () => {
                      }
                    },
                    //原生的事件,用nativeOn
                    nativeOn: {
                      click() {
                        this_v.getAllEmployee()
                      }
                    }
                  },
                  this_v.employeeList.map(item => {
                    return h('Option', {
                      props: {
                        value: item.id
                      }
                    }, item.employee_name)

                  })
              )
            }
          },
          {
            title: '公司电话',
            align: 'center',
            key: 'company_phone'
          },
          {
            title: '公司邮编',
            align: 'center',

            key: 'company_postcode'
          },
          {
            title: '公司地址',
            align: 'center',

            key: 'company_address'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        //表格数据
        data: []
      },
      searchParams: {} //搜索条件
    }
  },
  methods: {
    //全选
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    async getTableData() {
      await companyList(this.searchParams).then(res => {
        const {code, data, msg} = res

        if (code !== 200) {
          this.$Message.error(msg)
          return false;
        }

        this.tableData.data = data.company_data.map(item => {
          if (this.isFull(item.follow_up_employee)) {
            item.follow_up_employee_name = item.follow_up_employee.employee_name
          }
          return item
        })
        this.dataTotal = data.total
      })
    },
    //跳转分页
    jumpPage(page) {
      this.searchParams.page = page
      this.getTableData()
    },
    //选择每页条数
    pageSizeChange(per_page) {
      this.searchParams.per_page = per_page
      //选择每页条数的时候 ,只有 是第一页的时候,去获取数据
      if (this.searchParams.page == 1) {
        this.getTableData()
      }
    },
    jumpEnter(page) {
      console.log(page)
    },
    // eslint-disable-next-line no-unused-vars
    show(row) {
    },
    // eslint-disable-next-line no-unused-vars
    rowClick(row) {
      // console.log(row)
      // console.log(123)
    },
    removeCompany(row) {
      let company_id = row.id

      let this_v = this
      this.$Modal.confirm({
        title: '删除提醒',
        content: '确认要删除该公司记录么?该公司所属的 [联系人] 以及 [跟进记录] 也将一并删除,请慎重!',
        loading: true,
        async onOk() {
          postDelCompany({
            company_id
          }).then(res => {
            const {code, msg} = res
            if (code !== 200) {
              this_v.$Message.error(msg)
            }
            this_v.$Message.success(msg)

            this_v.getTableData()

            this_v.$Modal.remove()
          })
        },
        onCancel() {
        }
      })
    },
    //公司相关搜索
    companySearch(value, params) {
      let filed_name = params.column.key;
      this.searchParams[filed_name] = value

      //员工显示的是姓名,但是要搜索的是id
      if (filed_name == 'follow_up_employee_name') {
        this.searchParams['followup_employee_id'] = value
      }
      this.searchParams.page = 1 // 搜索页码还原
      this.getTableData()
    },
    async getAllEmployee() {
      //已存在,不查询
      if (this.employeeList.length > 0) {
        return
      }

      await getAllEmployee().then(res => {
        const {data, code} = res
        if (code !== 200) {
          return false;
        }

        this.employeeList = data.employee_data
      })
    },
    //添加公司,重置表单
    addCompany() {
      this.opearCompanyStatus = 'create'
      //  初始化form表单
      this.companyFormData = _.clone(originCompanyForm)
      //初始化 rules
      this.companyHandleReset('companyForm')

      //获取员工
      this.getAllEmployee()

      //打开modal
      this.companyModalOpear(true)

    },
    //操作modal 框
    companyModalOpear(isShow = true) {
      this.companyModalShow = isShow
    },
    fullScreenLoading(isShow = true) //全屏loading
    {
      if (isShow) {
        this.$Spin.show({
          render: (h) => {
            //父元素
            return h('div', {
                  'class': 'loading-div',
                  attrs: {},
                  props: {}
                },
                // 子元素
                [
                  h('Icon', {
                    'class': 'circle-spin-icon-load',
                    props: {
                      type: 'ios-loading',
                      size: 18,
                    }
                  }),
                  h('div', '加载中...')
                ])
          }
        });
        return
      }
      this.$Spin.hide()
    },
    async flushCompany() {
      this.fullScreenLoading(true) //全屏loading
      this.searchParams=_.clone(searchParams) //重置搜索条件
      await this.getTableData() //获取 列表数据
      this.fullScreenLoading(false) //全屏loading
      this.$Message.success('刷新成功')
    },
    //编辑,修改跟进成功之后统一 操作
    companyOpearSuccessCommon(res) {
      const {code, msg} = res
      if (code !== 200) {
        this.$Message.error(msg)  //失败消息提示
        return false
      }
      this.$Message.success(msg) //成功消息提示

      this.getTableData() //刷新公司列表

      this.companyModalOpear(false) //隐藏modal框
    },
    //提交公司form表单
    companyHandleSubmit(name) {
      //butotn loading
      this.companySubmitLoadingOpear(true)

      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let subData = _.clone(this.companyFormData);
          //添加公司
          if (this.opearCompanyStatus == 'create') {
            await postAddCompany(subData).then(res => {
              this.companySubmitLoadingOpear(false) //隐藏loading

              this.companyOpearSuccessCommon(res)
            })
          }
          //保存公司
          else if (this.opearCompanyStatus == 'edit') {
            // console.log(subData)
            await postEditCompany(subData).then(res => {
              this.companySubmitLoadingOpear(false) //隐藏loading

              this.companyOpearSuccessCommon(res)
            })
          }


        } else {
          this.$Message.error('请检查是否填写正确!');
          this.companySubmitLoadingOpear(false) //隐藏loading
        }
      })
    },
    //重置form表单
    companyHandleReset(name) {
      this.$refs[name].resetFields();
    },
    //保存/修改 按钮的 loading
    companySubmitLoadingOpear(isShow = true) {
      this.companySubmitLoading = isShow
    },
    //编辑公司,获取详情
    async editCompany(row) {
      let company_id = row.id
      await getCompanyDetail({
        company_id
      }).then(res => {
        const {code, data, msg} = res
        if (code !== 200) {
          this.$Message.error(msg)
          return false
        }

        this.opearCompanyStatus = 'edit'

        this.companyFormData = data.company_data

        this.companyFormData.company_id = this.companyFormData.id // 公司ID重新赋值

        this.getAllEmployee()
        //打开modal
        this.companyModalOpear(true)
      })
    }
  },

  created() {
    this.searchParams=_.clone(searchParams)//搜索默认值
    this.getTableData()
  },
  mounted() {
  }
}
</script>

<style scoped lang="less">

.selectButton {
  text-align: right;
}

.selectitem {
  margin-right: 5px;
}

/deep/ #search_input {
  .ivu-input {
    //text-align: center;
  }
}

#content-div {
  .but-left:not(:first-child) {
    margin-left: 20px;
  }
}

/deep/ .loading-div {
  /deep/ .circle-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
}


</style>

<style>
.circle-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>
