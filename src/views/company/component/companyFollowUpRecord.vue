<template>
  <!--  跟进记录 组件-->
  <div id="company-follow-up-record">
    <Row id="content-body">

      <Col span="24" :style="{'margin-bottom':'10px'}">
        <span style="font-size: 16px">未完成 ({{ undoneTableData.length }}条)</span>
        <Button class="but-left" @click="addContactButton" :size="'large'" icon="md-add" type="primary" ghost>添加跟进
        </Button>
        <Button class="but-left" @click="completeFollowUp" :size="'large'" icon="md-checkmark" type="primary" ghost>
          完成
        </Button>
        <Button class="but-left" :size="'large'" icon="ios-sync" type="default" @click="flushContact">刷新</Button>
      </Col>


      <Col span="24">
        <!--        未完成跟进表格-->
        <Table ref="nodoneTable" border :columns="undoneTablecolumns" :data="undoneTableData">

          <template #action="{ row }">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editFollow(row.id)">编辑</Button>
            <Button type="error" size="small" @click="delFollow(row.id)">删除</Button>
          </template>

        </Table>

      </Col>


      <Col span="24" :style="{'margin-bottom':'10px','margin-top':'10px'}">
        <span style="font-size: 16px">已完成 ({{ doneTableData.length }}条)</span>
      </Col>


      <Col span="24">
        <!--        已完成跟进表格-->
        <Table border :columns="doneTablecolumns" :data="doneTableData" :row-class-name="downRowClassName">
        </Table>

      </Col>


    </Row>


    <!--    弹出框-->

    <Modal
        @on-cancel="closeModal"
        width="600"
        id="follow-modal"
        :footer-hide="true"
        ref="FollowRef"
        :mask-closable="false"
        v-model="followmodalShow"
        :title="this.editStatus == 'create' ? '添加跟进': '修改跟进' "
    >

      <Form ref="FollowForm" :model="followFormData" :rules="followRuleValidate" :label-width="100"
            id="follow_form">
        <Row>

          <!--          安排时间 s-->
          <Col span="12">

            <FormItem prop="arrange_time" label="安排时间">
              <DatePicker type="date" placeholder="请选择安排时间" v-model="followFormData.arrange_time"></DatePicker>
            </FormItem>

          </Col>
          <!--          姓名 e-->


          <!--          跟进人s-->
          <Col span="12">
            <FormItem label="跟进人" prop="follower_id">
              <Select v-model="followFormData.follower_id"
                      placeholder="请选择跟进人"
                      :filterable="true"
                      ref="dataSetfollower">
                  <Option  v-for="item in employeeList" :value="item.id" :key="item.id">{{ item.employee_name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <!--          跟进人e-->


          <!--          联系人 s-->
          <Col span="12">
            <FormItem label="联系人" prop="contact_id">
              <Select v-model="followFormData.contact_id"
                      placeholder="请选择联系人"
                      :filterable="true"
                      ref="dataSetContact">
                  <Option v-for="item in companyContactData" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <!--          联系人 e-->

          <!--          联系方式 s-->
          <Col span="12">
            <FormItem label="联系方式" prop="contact_information">
              <Select v-model="followFormData.contact_information" placeholder="请选择联系方式">
                <template v-for="(item) in formContactInformation">
                  <Option :key="item.id" :value="item.id">
                    {{ item.name }}
                  </Option>
                </template>
              </Select>
            </FormItem>
          </Col>
          <!--          联系方式 e-->


          <Col span="12">
            <!--        跟进阶段 s-->
            <FormItem label="跟进阶段" prop="followup_phase">
              <Select v-model="followFormData.followup_phase" placeholder="请选择跟进阶段">

                <template v-for="(item,index) in followUpPhase">
                  <Option :key="index" :value="index">
                    {{ item }}
                  </Option>
                </template>
              </Select>
            </FormItem>
            <!--        跟进阶段 e-->
          </Col>


          <Col span="24">
            <FormItem label="备注" prop="remark">
              <Input v-model="followFormData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                     placeholder="请输入备注"></Input>
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="跟进状态" prop="followup_status">
              <CheckboxGroup v-model="followFormData.followup_status">
                <template v-for="(item) in followUpStatus">
                  <Checkbox :key="item.id" :label="item.id" @change.native="changeCheckBox(item)">
                    {{ item.name }}
                  </Checkbox>
                </template>
              </CheckboxGroup>
            </FormItem>
          </Col>


          <Col span="24" style="text-align: right">
            <FormItem>
              <Button type="primary" :loading="followSubmitLoading" @click="followHandleSubmit('FollowForm')">
                <span v-if="!followSubmitLoading">
                  {{ editStatus == 'create' ? '新增跟进' : '修改跟进' }}
                </span>
                <span v-else>处理中...</span>
              </Button>
              <Button @click="followHandleReset('FollowForm')" style="margin-left: 8px">重置</Button>
            </FormItem>

          </Col>

        </Row>

      </Form>
      <!--      自定义页脚-->
      <!--      <div slot="footer"></div>-->
    </Modal>
  </div>
</template>

<script>
//原始的form表单数据
import {
  companyAddFollow,
  delFollow,
  getAllEmployee,
  getFollowSimple,
  getFollowupList, postEditFollow, postFollowBatchDonw
} from "@/api/realRequest/v1/company";

const originFollowForm = {
  //mobile 计数器
  arrange_time: '',
  follower_id: '',
  contact_id: '',
  contact_information: '',
  followup_phase: '',
  remark: '',
  followup_status: [],
};
const follow_common_table_field = [
  {
    title: '安排时间/人',
    key: 'arrange_time_with_user'
  },
  {
    title: '创建时间/人',
    key: 'created_at_with_user'
  },
  {
    title: '联系人',
    key: 'contact_name'
  },
  {
    title: '联系方式',
    key: 'contact_information_a'
  },
  {
    title: '阶段',
    key: 'followup_phase_a'
  },
  {
    title: '备注',
    key: 'remark'
  },
]
import _ from "lodash";

export default {
  name: "companyFollowUpRecord",
  inject: [],
  props: {
    companyContactData: {
      type: Array
    }
  },
  created() {
    this.getFollow()
  },
  mounted() {
  },
  data() {
    return {
      //默认是创建
      editStatus: 'create',
      //未完成跟进任务
      undoneTablecolumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        ...follow_common_table_field,
        {
          title: '操作',
          slot: 'action',
          width: 130,
          align: 'center'
        }
      ],
      undoneTableData: [],
      //已完成跟进任务
      doneTablecolumns: [
        ...follow_common_table_field,
      ],
      doneTableData: [],
      formContactInformation: [
        {
          id: 1,
          name: '电话'
        },
        {
          id: 2,
          name: '邮件'
        },
        {
          id: 3,
          name: '会面'
        },
        {
          id: 4,
          name: '其他'
        },
      ],
      followUpStatus: [
        {
          id: 2,
          name: '已完成'
        }
      ],
      followUpPhase: {
        understand: '了解客户需求及开通使用',
        send: '发送资料',
        meet: '见面',
        contract: '确定方案合同',
        renew: '续约电话',
        train: '培训',
        other: '其他',
      },
      employeeList: [], //员工列表
      requestParams: this.$route.query,
      followFormData: {},
      //modal框
      followmodalShow: false,
      //表单校验规则
      followRuleValidate: {
        arrange_time: [
          {required: true, type: 'date', message: '请选择安排时间', trigger: 'blur,change'},
        ],
        follower_id: [
          {required: true, type: 'number', message: '请选择跟进人', trigger: 'blur,change'},
        ],
        contact_id: [
          {required: true, type: 'number', message: '请选择联系人', trigger: 'blur,change'}
        ],
        contact_information: [
          {required: true, type: 'number', message: '请选择联系方式', trigger: 'blur,change'}
        ],
        followup_phase: [
          {required: true, message: '请选择跟进阶段', trigger: 'blur,change'}
        ],
      },
      followSubmitLoading: false,
      currentContact:'', //当前联系人
      currentFollow:''//当前跟进人
    }
  },
  methods: {
    //获取跟进任务列表
    async getFollow() {
      await getFollowupList({
        company_id: this.requestParams.company_id
      }).then(res => {
        const {code, msg, data} = res
        if (code !== 200) {
          this.$Message.error(msg)
          return false
        }
        let undoneTableGen = [];
        let doneTableGen = [];

        data.result.forEach(item => {
          item.arrange_time_with_user = item.arrange_time + '/' + item.follow_user.employee_name;
          item.created_at_with_user = item.created_at + '/' + item.create_user.employee_name
          item.contact_name = item.contact.name
          item.contact_information_a = this.formContactInformation.find(v => v.id == item.contact_information).name
          item.followup_phase_a = this.followUpPhase[item.followup_phase]
          switch (item.followup_status) {
            case 1:
              undoneTableGen.push(item)
              break;
            case 2:
              doneTableGen.push(item)
              break;
          }
        })

        this.undoneTableData = undoneTableGen
        this.doneTableData = doneTableGen

      })
    },
    //获取所有员工
    async getEmployeeList() {
      if (this.employeeList.length > 0) {
        return
      }
      await getAllEmployee().then(res => {
        const {code, data, msg} = res
        if (code !== 200) {
          this.$Message.error(msg)
          return false
        }
        this.employeeList = data.employee_data
      })
    },
    followHandleReset(name) {
      this.$refs[name].resetFields();
    },
    //添加 跟进记录  ,需要重置表单
    addContactButton() {
      this.editStatus = 'create'
      //  初始化form表单
      this.followFormData = _.cloneDeep(originFollowForm)
      //初始化 rules
      this.followHandleReset('FollowForm')

      //获取员工
      this.getEmployeeList()

      //打开modal
      this.modalOpear(true)

    },
    //操作modal 框
    modalOpear(isShow = true) {
      this.followmodalShow = isShow
    },
    //刷新列表
    flushContact() {
      this.getFollow()
      this.$Message.success('刷新跟进任务成功')
    },
    submitToLoading(isShow = true) {
      this.followSubmitLoading = isShow
      if(isShow)
      {
        //5秒后,无论成功失败,都还原
        setTimeout(()=>{
          this.followSubmitLoading=false
        },5000)
      }
    },
    //编辑,修改跟进成功之后统一 操作
    opearSuccessCommon(res) {
      const {code, msg} = res
      if (code !== 200) {
        this.$Message.error(msg)
        return false
      }
      this.$Message.success(msg)
      this.getFollow()

      this.modalOpear(false)
    },
    followHandleSubmit(name) {
      //butotn loading
      this.submitToLoading(true)

      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let subData = _.cloneDeep(this.followFormData);

          subData.company_id = this.requestParams.company_id

          subData.followup_status = this.followFormData.followup_status.join('') || 1

          if (this.editStatus == 'create') {
            await companyAddFollow(subData).then(res => {
              this.submitToLoading(false) //隐藏loading

              this.opearSuccessCommon(res)
            })
          } else if (this.editStatus == 'edit') {
            // console.log(subData)
            await postEditFollow(subData).then(res => {
              this.submitToLoading(false) //隐藏loading

              this.clearTheSelectBox() //清空select 搜索框

              this.opearSuccessCommon(res)
            })


          }


        } else {
          this.$Message.error('请检查是否填写正确!');
          this.submitToLoading(false) //隐藏loading
        }
      })
    },
    //批量完成跟进
    completeFollowUp() {
      let task_ids = this.$refs.nodoneTable.getSelection().map(item => item.id)
      if (task_ids.length <= 0) {
        this.$Message.error('抱歉,你还没有选择任何跟进任务')
        return false
      }

      let this_v = this
      this.$Modal.confirm({
        title: '完成提醒',
        content: '确认要完成选中的跟进任务么?',
        loading: true,
        async onOk() {

          task_ids = task_ids.join(',')

          await postFollowBatchDonw({
            task_ids
          }).then(res => {
            const {code, msg} = res
            if (code !== 200) {
              this_v.$Message.error(msg)
              return false
            }
            this_v.getFollow()
            this_v.$Message.success(msg)
            this_v.$Modal.remove()
          })
        },
        onCancel() {
        }
      })


    },
    downRowClassName() {
      // console.log(row,index)
      return 'demo-table-info-row'
    },
    //编辑跟进 任务
    async editFollow(follow_id) {
      await getFollowSimple({
        follow_id
      }).then(res => {
        const {code, data, msg} = res
        if (code !== 200) {
          this.$Message.error(msg)
          return false
        }

        this.editStatus = 'edit'

        this.followFormData = data.follow_data

        //这个多选框是个数组,其实如果是单选,不应该搞多选框的,这里能修改的 都是 未完成的
        this.followFormData.followup_status = []

        //获取员工
        this.getEmployeeList()


        //打开modal
        this.modalOpear(true)
      })
    },
    //删除跟进
    delFollow(id) {
      let this_v = this
      this.$Modal.confirm({
        title: '删除提醒',
        content: '确认要删除该跟进记录么',
        loading: true,
        async onOk() {
          await delFollow({
            id
          }).then(res => {
            const {code, msg} = res
            if (code !== 200) {
              this_v.$Message.error(msg)
            }
            this_v.$Message.success(msg)

            this_v.getFollow()

            this_v.$Modal.remove()
          })
        },
        onCancel() {
        }
      })
    },
    changeCheckBox() {
      //此处是单选,重新赋值
      // this.followFormData.followup_status=[item.id]
    },
    clearTheSelectBox()
    {
      //清空搜索项
      this.$refs.dataSetfollower.$data.query=''
      this.$refs.dataSetContact.$data.query=''
    },
    //关闭模态框
    closeModal() {
      this.clearTheSelectBox()
    },
  }
}
</script>

<style scoped lang="less">
#content-body {
  .but-left:not(:first-child) {
    margin-left: 20px;
  }

  /deep/ .ivu-table .demo-table-info-row td {
    background-color: #e3f1ce;
    color: #333333;
  }

}


</style>
