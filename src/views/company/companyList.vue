<template>
  <div id="company_list">


    <Card style="width:100%">
      <h3 slot="title">
        <Icon type="ios-film-outline"></Icon>
        <span :style="{'margin-left':'5px','vertical-align':'middle'}">公司列表</span>
      </h3>

      <template #extra>

      </template>

      <div>

        <Table
            @on-row-click="rowClick"
            stripe border ref="selection" :columns="tableData.columns" :data="tableData.data">

          <template #action="{row}">
            <!--           <Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">查看</Button>-->
            <Button type="error" size="small" @click="removeCompany(row)">删除</Button>
          </template>

        </Table>

        <Row :style="{display: 'flex','margin-top':'20px'}">
          <Col span="20">
            <Page @on-page-size-change="pageSizeChange"
                  @on-change="jumpPage"
                  :page-size="pagination.perPage"
                  :total="pagination.dataTotal"
                  show-total show-elevator show-sizer></Page>
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

  </div>
</template>

<script>
//引入接口文件
import {companyList, postDelCompany, getAllEmployee} from "@/api/realRequest/v1/company";

export default {
  name: "companyList",
  data() {
    //保留 当前的this,也就是当前vue 实例
    let this_v = this;
    return {
      employeeList: [],
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
                  id:'search_input',
                  placeholder: '公司名称',
                },
                props: {
                  clearable: true,
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
                      style:"width:150px",
                      placeholder: '跟进人',
                    },
                    props: {
                      clearable: true,
                    },
                    //iview 组件 的事件,要用on
                    on: {
                      'on-change': (value) => {
                        this_v.companySearch(value, params)
                      },
                      "on-clear": () => {}
                    },
                    //原生的事件,用nativeOn
                    nativeOn: {
                      click()
                      {
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
      pagination: {
        //当前页
        page: 1,
        //数据总数
        dataTotal: 0,
        //每页条数
        per_page: 10
      },
      searchParams: { //搜索条件
        page: 1,
        per_page: 10,
        company_name: '',//公司名称
        followup_employee_id: 0//员工id
      }
    }
  },
  methods: {
    //全选
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    async getTableData() {
      // console.log(this.pagination)
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
        this.pagination.dataTotal = data.total
        // this.$Message.success('请求成功')
      })
    },
    //跳转分页
    jumpPage(page) {
      this.pagination.page = page
      this.searchParams.page=page
      this.getTableData()
    },
    //选择每页条数
    pageSizeChange(per_page) {
      this.pagination.per_page = per_page
      this.searchParams.per_page=per_page
      //选择每页条数的时候 ,只有 是第一页的时候,去获取数据
      if (this.page == 1) {
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
  },

  created() {
    this.getTableData()
  },
  mounted() {
  }
}
</script>

<style scoped lang="less">
.pagination {
}

.selectButton {
  text-align: right;
}

.selectitem {
  margin-right: 5px;
}
/deep/#search_input{
 .ivu-input{
   text-align: center;
 }
}
</style>
