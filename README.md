# bl-tempToUwp-front
对接uwp的模板
## 部署文档
> - 每次部署生产环境请开发人员填写部署文档，包括修改线上bug
> - [生产环境部署文档](./生产环境部署文档.md)

## 分支开发拉取
> - 请按照wiki的的git分支管理来拉取分支和开发
> - [git分支管理规范](https://wiki.digi800.com/pages/viewpage.action?pageId=27663699)
## Router
> - Router文件已按照module拆分，具体写法请查看文件里面的例子， 后续的路由文件请按照模块拆分书写
> - 每个页面请对应一个路由，例如相同的新增和编辑页面，请分成两个路由配置
> - **_<font color='red'>菜单页面之前请不要使用路由传递参数，禁止使用这种方案，开发人员请牢记</font>_**
> - 每个路由里面的meta属性，有以下几个字段是必填写的：
> menuCode(当前菜单的code，是在uwp系统新建资源的时候获取的，用来跟后台返回的菜单建立映射关系)，
> permissionId(当前菜单所依赖的父级菜单的menuCode)，
> activeMenu(当前菜单所依赖的父级菜单的完整path，用来将菜单选中)
## 表单自动化生成和展开收起
> - 直接访问'/test'链接，可查看具体实例
> - 支持自定义组件，但是该自定义的表单需要实现v-model的双向绑定
> - 支持下拉数据异步请求获取
> - 其中rule字段是配置规则使用，可通过改变this指向的方式，抽取一个js文件专门配置字段规则，具体实例请点击下面链接
> - [具体实例页面请点击此处](./src/views/formTemplate/index.vue)
> - [表单自动化插件官方文档](http://www.form-create.com/v2/guide/#%E4%B8%8B%E8%BD%BD)
> - 个人建议请使用<font color='red'>formCreate.maker</font>的方式来创建表单，可保证页面整体的布局和UI展示。已将展开收起、页面布局和自动化生成表单封装成组件，
## echarts图表
> - 已将echarts单独封装成一个组件
> - 当页面存在多个echarts时，需要给每个echarts定义一个id,可通过改变this指向的方式，抽取一个js文件专门配置字段规则，具体实例请点击下面链接
> - [具体实例页面请点击此处](./src/views/trendChart/index.vue)
> - [可配置的参数可查看该页面](./src/components/echarts/index.vue)
## Scss
> - _variables.scss和_mixin.scss已经挂载在全局不用局部引入
> - index.scss已动态生成padding，margin，text-align，使用前请先阅读
> - 字号目前只设定了三种大小，12、16、22，使用方法调用_mixin的classFontsize方法，不写字号默认走12，需要写字号请从_variables.scss的变量选择三种值
## Menu
> - 菜单目前是通过前端的处理路由表生成的，新建菜单只需在对应模块的路由表里面添加路由即可
> - 通过后台返回的菜单然后结合前端生成用户路由表展示并配置权限
> - 会根据settings.js里面的systemId是否有值来作为划分。如果有值，会根据后台返回的菜单列表来展示（会将后台返回的menuName重新赋值给meta.title），如果没值，会根据前端的全部路由表来展示。同时，可配置字段children字段来循环子集
## Axios
> 目前只对axios的几个请求方法进行了简单地封装，具体使用可看api文件下的例子
## Lodash
> 已安装了lodash第三方库，常见的防抖节流，数组方法请直接使用提供的方法
## 导出功能
> 页面上的导出功能，请在api的接口文件里面添加上{ responseType: 'blob' }即可
## mixins
> import pageMixin from '../../utils/mixin'; 目前只存放了分页类的相关属性
## utils
>  - uploadResponse.js设置了上传文件后如果需要返回错误提示的excle文件方法
> - veeValidate.js一款校验插件，可以自定义校验方法，具体使用可查看百度方法
> - originFrom.js设置了从其他系统跳转进来的时候，在链接带有token时，将token存到本地并直接跳过登录操作这一步
