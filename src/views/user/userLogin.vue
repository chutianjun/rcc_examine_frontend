<template>
  <div>

    <div class="login-container">
      <Form ref="LoginForm" :model="LoginFormData" :rules="LoginRuleValidate" :label-width="60"
            id="LoginForm">
        <Row>

          <Col>
            <h3 class="login_title">系统登录</h3>
          </Col>

          <Col span="24">
            <FormItem label="姓名" prop="name">
              <Input v-model="LoginFormData.employee_name" placeholder="请输入姓名" @keyup.enter.native="LoginHandleSubmit('LoginForm')"></Input>
            </FormItem>
            <FormItem label="密码" prop="name">
              <Input type="password" v-model="LoginFormData.password" placeholder="请输入密码" @keyup.enter.native="LoginHandleSubmit('LoginForm')"></Input>
            </FormItem>
          </Col>

          <Col span="24" style="text-align: right">
            <FormItem>
              <Button type="primary" :loading="LoginSubmitLoading" @click="LoginHandleSubmit('LoginForm')">
                <span v-if="!LoginSubmitLoading">
                  登录
                </span>
                <span v-else>处理中...</span>
              </Button>
              <Button @click="LoginHandleReset('LoginForm')" style="margin-left: 8px">重置</Button>
            </FormItem>

          </Col>

        </Row>

      </Form>
    </div>

  </div>
</template>

<script>
import {userLogin} from "@/api/realRequest/v1/user";

export default {
  name: "userLogin",
  data() {
    return {
      LoginRuleValidate: {
        employee_name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      LoginFormData: {
        employee_name: '',
        password: ''
      },
      LoginSubmitLoading: false
    }
  },
  methods: {
    submitToLoading(isShow = true) {
      this.LoginSubmitLoading = isShow
      if(isShow)
      {
        //5秒后,无论成功失败,都还原
        setTimeout(()=>{
          this.followSubmitLoading=false
        },5000)
      }

    },
    LoginHandleSubmit(name) {
      this.submitToLoading(true)
      this.$refs[name].validate((valid) => {
        if (valid) {
          userLogin(this.LoginFormData).then(res => {
            this.submitToLoading(false) //关闭loading

            const {code, data,msg} = res
            if (code !== 200 || data.token == '') {
              this.$Message.error(msg)
              return false;
            }
            //赋值token
            const token = data.token
            window.localStorage.setItem("examine_Authorization", token);
            window.localStorage.setItem("employee_info", JSON.stringify(data.employee_info));
            //路由跳转
            this.$router.push({name: 'Home'})
          })
        } else {
          this.$Message.error('请检查是否填写正确!');
          this.submitToLoading(false) //关闭loading
        }
      })


    },
    LoginHandleReset(name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background-coLor: #fff;
  border: 1px solid #eee;
  box-shadoiv: 0 0 25px #cac6c6;
}

.login_title {
  font-size: 20px;
  text-align: center;
  margin: 0px auto 40px auto;
  text-atign: center;
  coLor: #f05458;
}

.login-submit {
  margin: 10px auto 0px auto;
}
</style>
