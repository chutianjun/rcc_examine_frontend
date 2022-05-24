<template>
  <div class="layout_div">

    <Layout :style="{minHeight: '100vh'}">
      <Sider ref="side1" hide-trigger :style="{ boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}" collapsible
             :collapsed-width="78" v-model="isCollapsed">

        <div class="layout-logo-left">
          <img :src="companyLogo" width="80%">
        </div>

        <Menu :active-name="activeName" theme="dark" width="auto" :open-names="['1']" :class="menuitemClasses">
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              <span>公司管理</span>
            </template>
            <MenuItem name="companyList" to="/company/list">
              <Icon type="md-analytics"/>
              <span>公司列表</span>
            </MenuItem>

          </Submenu>

        </Menu>
      </Sider>


      <Layout>
        <Header :style="{padding: 0,background:'#515a6e'}" class="layout-header-bar">

          <Row>
            <Col span="22">
              <Icon @click="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px',color:'#ffffff'}"
                    type="md-menu"
                    size="24"></Icon>
            </Col>
            <Col span="2">
              <div  class="logodiv">
                <Dropdown trigger="hover">
                  <div>
                    <a href="javascript:void(0)">
                      <img :src="srcImg" width="40px" class="imglogo">
                    </a>
                    <span class="user_name_span">
                    {{isFull(current_user)?current_user.employee_name:'(^_^)'}}
                  </span>
                  </div>

                  <template #list>
                    <DropdownMenu>
                      <DropdownItem @click.native="logout">退出</DropdownItem>
                    </DropdownMenu>
                  </template>
                </Dropdown>

              </div>
            </Col>
          </Row>


        </Header>

        <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">


          <!--          内容 区域-->
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <router-view></router-view>
          </Content>
        </Content>
      </Layout>


    </Layout>

  </div>
</template>
<script>
export default {
  name: "MainPage",
  data() {
    return {
      isCollapsed: false,
      activeName: this.$route.name,
      companyLogo: require('@/assets/rcclogo.png'),
      srcImg: require('@/assets/rnf.jpg'),
      current_user:this.parseToJson(window.localStorage.getItem('employee_info'))
    }
  },
  mounted() {
  },
  computed: {
    rotateIcon() {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ];
    },
    menuitemClasses() {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    logout() {
      window.localStorage.removeItem('examine_Authorization')
      window.localStorage.removeItem('employee_info')
      this.$router.push({name:"Login"})
    }
  }
}
</script>
<style scoped lang="less">
.logodiv{
  text-align: center;
  .user_name_span{
    font-size: 17px;
    color: #ffffff;
  }
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.rotate-icon {
  transform: rotate(-90deg);
}

.menu-icon {
  transition: all .3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}

.layout-logo-left {
  text-align: center;
  width: 90%;
  height: 30px;
  border-radius: 3px;
  margin: 15px auto;
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0px;
  transition: width .2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}

.collapsed-menu span, {
  width: 0px;
  transition: width .2s ease;
}

.collapsed-menu .ivu-icon-ios-arrow-down {
  display: none;
}

.imglogo {
  border-radius: 50%;
  vertical-align: middle;
}
</style>

