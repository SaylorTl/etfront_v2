# etapp-v2

#### 安装依赖

```
npm install
```

#### 开发环境编译
```
npm run dev
```

#### 生产环境编译
```
npm run build
```

```
<!--服务器配置,先配置本地host-->
127.0.0.1 w.eptingche.cn
<!--配置nginx-->
server {
    listen 80;
    set $rootPath '/Users/zhangguiying/mydata/frontend/etapp-v2/dist';
    root $rootPath;
    index index.html;
    server_name w.eptingche.cn;
    if (!-e $request_filename) {
        rewrite ^/(.*)$ /index.html last;
    }
}
```


#### 自动化测试

```
npm run test
```

#### Vue 相关配置
 详见[Vue相关配置](https://cli.vuejs.org/config/)。

#### Vux 配置命令
进入[vux说明](https://doc.vux.li/zh-CN/install/npm.html)
```
vue add vux
vue invoke vux
```
详见 [Vux配置](https://www.npmjs.com/package/vue-cli-plugin-vux)说明。

#### 项目说明

​	本项目为前APPH5页面的升级改版，全局采用vue-cli3.0脚手架搭建，采用vue-cli集成的[babel](https://babeljs.io/)配置及[eslint](https://cn.eslint.org/)配置，eslint相关规则可在package.json中的rules项进行配置。另外，项目采用axios调用后端接口，路由采用动态加载方式以及Gzip方式进行打包压缩，可以在浏览者中稳定运行。

##### 项目目录结构

<pre>
.
├── README.md  //项目说明
├── axios.config.js  //axios全局配置
├── babel.config.js  //babel全局配置
├── dist             //打包文件夹
├── node_modules     //依赖包
├── package-lock.json  
├── package.json      //node相关
├── public            //静态资源、无需改动的
├── src   
│   ├── App.vue       //入口文件
│   ├── assets        //静态资源文件夹
│   ├── components    //公共组件文件夹
│   ├── const         //常量配置文件夹
│   ├── main.js       //入口JS
│   ├── router        //路由相关
│   ├── utils         //功能函数文件夹
│   ├── view          //视图文件夹
│   └── vuex          //全局状态管理文件夹
└── vue.config.js     //webpack打包，vue相关配置
</pre>
##### 命名规范

1. components文件夹下的组件采用大驼峰命名方式，例如：PlatePicker、MyLoading等；

2. view文件夹下的页面文件采用小驼峰命名方式，例如：tempPay、tempFee等；
3. 组件样式统一加上"ui-"前缀；
4. 页面样式统一以路由name作为父级class，加上前缀"page-"。

##### 格式化

1. js采用eslint进行管理及格式化；

2. css样式prettier;
3. vue页面采用JS-CSS-HTML Formatter进行管理及格式化；

##### 通用组件

> loading

​	页面加载组件。

实例：

``` javascript
//显示
this.$loading.show();
this.$loading.show({
  content:'加载中...'
})
this.$loading.show({
  content:'加载中...',
  duration:3000 //单位毫秒
})
this.$loading.show({
  el:this.$refs.aaa,//容器，默认document.body，el参数会使loading容器变为absolute绝对定位。
  content:'加载中...',
  duration:3000 //单位毫秒
})
this.$loading.show({
  el:this.$refs.aaa,//容器，默认document.body
  content:'加载中...',
  duration:3000 //单位毫秒
  mask:true //是否有圆角方形背景
})
//隐藏
this.$loading.hide()
```

传参：

| 参数名称 | 参数类型 |           说明            |
| :------: | :------: | :-----------------------: |
|    el    | dom节点  | 非必填，默认document.body |
| content  |  String  |      非必填，默认''       |
| duration |  number  |  非必填，默认0，单位毫秒  |



> plate-picker

​	车牌输入组件，可以自定义输入特殊车牌

实例：

``` javascript
//引入
import PlatePicker from '../components/plate-picker/index';
components:{
  PlatePicker
}
```

``` html
<plate-picker :isSpecial="isSpecial" :initPlate="plate" @ok="getPlate"></plate-picker>
```

传参：

| 参数名称  | 参数类型 |      说明       |
| :-------: | :------: | :-------------: |
| isSpecial | dom节点  | 必填，默认false |
| initPlate |  String  | 非必填，默认''  |

事件：

| 事件名称 |                             说明                             |
| :------: | :----------------------------------------------------------: |
|    ok    | 实时获取输入的车牌号，返回车牌信息：{isGreen:true,isError:true,plate:'粤B12345'} |

> history-plate

实例：

```javascript
//引入
import HistoryPlate from '../components/history-plate/index';
components:{
  HistoryPlate
}
```

``` html
<history-plate :historyPlates="historyPlates" :showHistory="showHistory" @historyChange="showHistoryPlate"></history-plate>
```

传参：

|   参数名称    |    参数类型     |      说明      |
| :-----------: | :-------------: | :------------: |
| historyPlates | array(一维数组) |  必填，默认[]  |
|  showHistory  |     String      | 必填，无默认值 |

事件：

|   事件名称    |                             说明                             |
| :-----------: | :----------------------------------------------------------: |
| historyChange | 滑动返回车牌号，当历史记录为空时不显示，默认返回历史结果的第一条 |

> stations

​	停车场选择组件，该组件比较特殊，使用地方较少，可根据传参做适当修改，无需选择车场后返回当前页面。

实例：

``` javascript
//通过路由跳转
 this.$router.push({
       path:'/stations',
       query:{
            plate:this.plate,//额外传参
            urlName:'cost' //选择车场后需要跳转的路由名称
            type:'station'//station表示只选择车场，否则会选择楼栋信息
       }
 })
//车场选择后返回
this.$router.push({
     name: this.urlName,//接收到的跳转页
     query: {
         stationInfo: JSON.stringify(this.stationInfo), //返回station,stationName,address
         buildingInfo:JSON.stringify(this.buildingInfo),//type不是station时返回
         roomInfo:JSON.stringify(this.roomInfo),//type不是station时返回
         plate: this.plate 
     }
})
```

