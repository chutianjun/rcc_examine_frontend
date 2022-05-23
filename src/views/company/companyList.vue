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
            <Page @on-page-size-change="pageSizeChange" @on-change="jumpPage" :page-size="pagination.perPage"
                  :total="pagination.dataTotal" show-total show-elevator show-sizer></Page>
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
import {companyList, delFollow, postDelCompany} from "@/api/realRequest/v1/company";

export default {
  name: "companyList",
  data() {
    return {
      tableData: {
        //表格表头
        columns: [
          //  多选框
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: '公司名称',
            key: 'company_name',
            // eslint-disable-next-line no-unused-vars
            render(h, params) {
              return h('a', {
                attrs: {
                  href: '/company/detail?company_id=' + params.row.id,
                },
                on: {
                  click: () => {
                  }
                }
              }, params.row.company_name)
            }
          },
          {
            title: '跟进人',
            key: 'follow_up_employee_name'
          },
          {
            title: '公司电话',
            key: 'company_phone'
          },
          {
            title: '公司邮编',
            key: 'company_postcode'
          },
          {
            title: '公司地址',
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
      await companyList({
        page: this.pagination.page,
        per_page: this.pagination.per_page
      }).then(res => {
        const {code, data,msg} = res

        if(code!==200)
        {
          this.$Message.error(msg)
          return false;
        }

          this.tableData.data = data.company_data.map(item => {
            if (!this.isBlank(item.follow_up_employee)) {
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
      this.getTableData()
    },
    //选择条数
    pageSizeChange(per_page) {
      this.pagination.per_page = per_page
      this.getTableData()
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
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
  }
}
</script>

<style scoped>
.pagination {
}

.selectButton {
  text-align: right;
}

.selectitem {
  margin-right: 5px;
}
</style>
