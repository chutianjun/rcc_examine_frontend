<template>
  <div id="company-detail-div">
    <Row>
      <Col span="24">
        <template v-if="companyData.id">
          <Card :bordered="false" :style="{background:'#f8f8f8','margin-bottom':'10px'}">
            <div>
              <h1>
                {{ companyData.company_name }}
              </h1>
            </div>
          </Card>

          <Card class="detail_card" :style="{'margin-bottom':'20px'}">
            <h2 slot="title">
              <Icon type="ios-film-outline"></Icon>
              <span :style="{'margin-left':'5px','vertical-align':'middle'}">基本信息</span>
            </h2>

            <div>

              <Row class="detail_row">
                <Col :span="2">
                  <span class="virtual_color">跟进人</span>
                </Col>
                <Col :span="2">
                  <span class="left_span">
                      {{ isBlank(companyData.follow_up_employee)?'':companyData.follow_up_employee.employee_name }}
                  </span>
                </Col>
              </Row>


              <Row class="detail_row">
                <Col :span="2">
                  <span class="virtual_color">公司电话</span>
                </Col>
                <Col :span="3">
                    <span class="left_span">
                      {{ companyData.company_phone }}
                    </span>
                </Col>

                <Col :span="2" offset="4">
                  <span class="virtual_color">公司邮编</span>
                </Col>
                <Col :span="2">
                    <span class="left_span">
                     {{ companyData.company_postcode }}
                    </span>
                </Col>
              </Row>


              <Row class="detail_row">
                <Col :span="2">
                  <span class="virtual_color">公司地址</span>
                </Col>
                <Col :span="22">
                    <span class="left_span">
                        {{ companyData.company_address }}
                    </span>
                </Col>
              </Row>


            </div>

          </Card>

        </template>

      </Col>
    </Row>


    <Row>
      <Col span="24">

        <Tabs :style="{border:'1px solid #e8eaec'}" class="tabbar" @on-click="tabClick" :animated="false">
          <TabPane label="联系人" name="contact" icon="ios-contact">
            <Row :style="{'margin-bottom':'10px'}">
              <Col span="3">
                <Button @click="addContactButton" :size="'large'" icon="md-add" type="primary" ghost>添加联系人</Button>
              </Col>
              <Col span="2">
                <Button :size="'large'" icon="ios-sync" type="default" @click="flushContact">刷新</Button>
              </Col>
            </Row>

            <Row>
              <template v-for="(item) in companyContactData">
                <Col span="24" class="card_a" :key="item.id">
                  <Card style="width:100%" class="contact_card">
                    <Row>
                      <Col span="24">
                        <span class="user">{{ item.name }}</span>
                        <span class="honorific">
                          <template v-if="item.sex === 1">
                            先生
                          </template>
                          <template v-else-if="item.sex === 2">
                                    女士
                          </template>
                             <template v-else>
                                    未知
                          </template>
                        </span>
                        <span class="honorific_a">{{ item.department }}</span>
                        <Button type="warning" size="small" class="identity">
                          <template v-if="item.importance===1">
                            重要
                          </template>
                          <template v-else-if="item.importance===2">
                            普通
                          </template>
                          <template v-else>
                            未知
                          </template>
                        </Button>
                      </Col>

                    </Row>

                    <Row class="user_info">
                      <Col span="8">
                        <div class="user_div">
                          <div>手机</div>
                          <div class="honorific_d">
                            <template v-for="(item,index) in item.mobile.split(',')">
                              <div :key="index">{{ item }}</div>
                            </template>
                          </div>
                        </div>
                      </Col>
                      <Col span="8">
                        <span>电话</span>
                        <span class="honorific_b">
                          {{ item.phone ? item.phone : '暂无' }}
                        </span>
                      </Col>
                      <Col span="8">
                        <span>邮箱</span>
                        <span class="honorific_b">
                          {{ item.email }}
                        </span>
                      </Col>
                    </Row>

                    <Row class="remark_info">
                      <Col span="8">
                        <div class="user_div">
                          <div>备注</div>
                          <div class="honorific_d">
                            <div>
                              <template v-if="item.remark === null">
                                暂无备注
                              </template>

                              <template v-else>
                                {{ item.remark }}
                              </template>
                            </div>
                          </div>
                        </div>

                      </Col>
                    </Row>
                  </Card>
                </Col>

              </template>
            </Row>
          </TabPane>
          <!--          跟进记录相关-->
          <TabPane label="跟进记录" name="follow" icon="ios-create">
            <router-view :companyContactData="companyContactData"></router-view>
          </TabPane>
        </Tabs>
      </Col>
    </Row>


    <!--    弹出框-->

    <Modal
        :footer-hide="true"
        ref="contactRef"
        :mask-closable="false"
        v-model="modalShow"
        title="添加联系人"
    >

      <Form ref="ContactForm" :model="formData" :rules="ruleValidate" :label-width="60"
            class="contact_form">
        <Row>

          <!--          姓名 s-->
          <Col span="12">
            <FormItem label="姓名" prop="name">
              <Input v-model="formData.name" placeholder="请输入姓名"></Input>
            </FormItem>

          </Col>
          <!--          姓名 e-->


          <!--          性别 s-->
          <Col span="12">
            <FormItem label="性别" prop="sex">
              <Select v-model="formData.sex" placeholder="请选择性别">
                <Option value="1">男</Option>
                <Option value="2">女</Option>
              </Select>
            </FormItem>
          </Col>
          <!--          性别 e-->


          <!--          部门 s-->
          <Col span="12">
            <FormItem label="部门" prop="department">
              <Input v-model="formData.department" placeholder="请输入部门"></Input>
            </FormItem>
          </Col>
          <!--          部门 e-->

          <!--          重要性 s-->
          <Col span="12">
            <FormItem label="重要性" prop="importance">
              <Select v-model="formData.importance" placeholder="请选择重要性">
                <Option value="1">重要</Option>
                <Option value="2">普通</Option>
              </Select>
            </FormItem>
          </Col>
          <!--          重要性 e-->


          <Col span="18">
            <template v-for="(item, index) in formData.mobile_items">
              <FormItem
                  v-if="item.status"
                  :key="index"
                  :label="'手机 ' + item.index"
                  :prop="'mobile_items.' + index + '.value'"
                  :rules="checkMobile">
                <Row>
                  <Col span="18">
                    <Input v-model="item.value" placeholder="请输入手机号"></Input>
                    <!--                      <Input type="text" v-model="item.value" placeholder="Enter something..."></Input>-->
                  </Col>
                  <Col span="4" offset="1">
                    <Button type="error" size="small" shape="circle" icon="md-close" ghost @click="handleRemove(index)"
                            class="mobile_close">
                    </Button>
                  </Col>
                </Row>
              </FormItem>

            </template>
          </Col>


          <Col span="6" style="text-align: right">
            <Button icon="md-add" type="primary" ghost size="small" @click="addMobile" class="add_mobile">添加手机</Button>
          </Col>


          <Col span="12">
            <!--        电话s-->
            <FormItem label="电话" prop="phone">
              <Input v-model="formData.phone" placeholder="请输入电话 "></Input>
            </FormItem>
            <!--        电话e-->
          </Col>


          <Col span="12">

            <!--        邮箱s-->
            <FormItem label="邮箱" prop="email">
              <Input v-model="formData.email" placeholder="请输入邮箱"></Input>
            </FormItem>
            <!--        邮箱e-->

          </Col>

          <Col span="24">
            <FormItem label="备注" prop="remark">
              <Input v-model="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                     placeholder="请输入备注"></Input>
            </FormItem>
          </Col>

          <Col span="24" style="text-align: right">
            <FormItem>
              <Button type="primary" :loading="submitLoading" @click="handleSubmit('ContactForm')">
                <span v-if="!submitLoading">保存联系人</span>
                <span v-else>处理中...</span>
              </Button>
              <Button @click="handleReset('ContactForm')" style="margin-left: 8px">重置</Button>
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
import _ from 'lodash'
import {companyAddContact, getCompanyDetail, getCompanyContact} from "@/api/realRequest/v1/company";
// eslint-disable-next-line no-unused-vars
//原始的form表单数据
const originContactForm = {
  //mobile 计数器
  mobile_counter: 1,
  name: '',
  sex: '',
  department: '',
  importance: '',
  phone: '',
  email: '',
  remark: '',
  //多个手机对象
  mobile_items: [
    {
      //该值是需要校验的值
      value: '',
      //索引
      index: 1,
      status: 1
    }
  ]
};
export default {
  name: "companyDetail",
  mounted() {
  },
  created() {
    this.formData = _.cloneDeep(originContactForm)
    this.getCompany()
    this.getContact()
  },
  data() {
    //手机号校验规则
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };

    return {
      //公司数据
      companyData: {},
      //公司联系人数据
      companyContactData: [],
      //手机号校验规则
      checkMobile: [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        //   //  自定义校验规则
        {validator: checkMobile, trigger: 'blur'}
      ],
      requestParams: this.$route.query,
      //form 表单数据
      formData: {},
      //表单校验规则
      ruleValidate: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 2, message: '姓名至少为2个字符', trigger: 'blur'},
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱', trigger: 'blur'}
        ],

      },
      modalShow: false,
      submitLoading: false
    }
  },
  methods: {
    async getContact() {
      await getCompanyContact({
        company_id: this.requestParams.company_id
      }).then(res => {
        const {code, data} = res
        if (code == 200) {
          this.companyContactData = data.result
        }
      })
    },
    async getCompany() {
      await getCompanyDetail({
        company_id: this.requestParams.company_id
      }).then(res => {
        const {code, data} = res
        if (code === 200) {
          this.companyData = data.company_data
        }
      })
    },
    handleSubmit(name) {
      //butotn loading
      this.submitToLoading()

      this.$refs[name].validate(async (valid) => {
        if (valid) {
          this.formData.mobile = this.formData.mobile_items.filter(item => item.status == 1 && item.value !== '').map(item => {
            return item.value
          }).join(',')
          this.formData.company_id = this.requestParams.company_id
          await companyAddContact(this.formData).then(res => {
            const {code, msg} = res

            this.submitToLoading(false)//隐藏loading

            if (code !== 200) {
              this.$Message.error(msg)
              return false
            }
            this.$Message.success(msg);
            this.getContact()
            this.modalOpear(false)


          }).catch(res => {
            console.log(res)
          })

        } else {
          this.$Message.error('请检查是否填写正确!');
          this.submitToLoading(false)//隐藏loading

        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    ok() {
      this.$Message.info(' ok');
    },
    cancel() {
      this.$Message.info(' cancel');
    },
    //添加手机输入框
    addMobile() {
      this.formData.mobile_counter++
      this.formData.mobile_items.push({
        value: '',
        index: this.formData.mobile_counter,
        status: 1
      });
    },
    handleRemove(index) {
      if (this.formData.mobile_items.length <= 1) {
        this.$Message.error("抱歉,最后一个手机号不能删除")
        return false;
      }
      if (this.formData.mobile_items.filter(item => item.status === 1).length <= 1) {
        this.$Message.error('抱歉,至少需要保留一个手机号')
        return false;
      }
      this.formData.mobile_items[index].status = 0
    },
    //刷新联系人
    flushContact() {
      this.getContact()
      this.$Message.success('刷新联系人成功')
    },
    //操作modal 框
    modalOpear(isShow = true) {
      this.modalShow = isShow
    },
    submitToLoading(isShow = true) {
      this.submitLoading = isShow
    },
    //添加联系人,需要重置表单
    addContactButton() {
      //  初始化form表单
      this.formData = _.cloneDeep(originContactForm)
      //初始化 rules
      this.handleReset('ContactForm')

      this.modalOpear(true)

    },

    tabClick(tabName) {
      switch (tabName) {
        case 'follow':
          this.$router.push({name: 'companyFollow', query: {company_id: this.requestParams.company_id}})
          break;
      }
    },
  },
  provide() {}
}
</script>

<style scoped lang="less">
.contact_form {
  .mobile_close {

    /deep/ .ivu-icon-md-close {
      margin-top: 1px;
    }
  }

  .add_mobile {
    margin-top: 6px
  }
}

.detail_card {
  /deep/ .ivu-card-head {
    background-color: #ebf5f9;
  }
}

.contact_card {
  .user {
    font-size: 18px;
    color: #1579f6;
  }

  .user_info {
    margin-top: 15px;
  }

  .honorific {
    margin-left: 5px;
  }

  .honorific_a {
    margin-left: 10px;
  }

  .honorific_b {
    margin-left: 15px;
  }

  .honorific_d {
    margin-left: 30px;

  }

  .identity {
    background: #fef5e9;
    border: 1px solid #fef5e9;
    color: #f59a23;
    position: relative;
    bottom: 2px;
    margin-left: 15px;
  }

  .remark_info {
    margin-top: 10px;
  }

  .user_div {
    display: flex
  }


}

.left_span {
  position: relative;
  left: -15px;
}

.detail_row {
  margin-top: 10px;
}

.virtual_color {
  color: #b2b2c8;
}

.tabbar {
  .card_a {
    margin-bottom: 20px;
  }

  /deep/ .ivu-tabs-bar {
    padding: 8px 0 0 0;
    background: #ebf5f9;
  }

  .ivu-tabs-content {
    .ivu-tabs-tabpane {
      padding: 0 10px 20px 10px;

    }
  }
}

/deep/ .ivu-tabs-nav {
  font-size: 18px;

  .ivu-icon {
    position: relative;
    bottom: 4px;
  }

  .ivu-tabs-tab {
    position: relative;
    bottom: 5px;
  }
}
</style>
