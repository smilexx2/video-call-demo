# Video Call Demo

A web based application to allow a user to have video call with others - powered by [agora.io.](https://www.agora.io)

## 在线 demo 链接

https://video-call-demo-uktkh.ondigitalocean.app/

## 实现功能

- [x] join / leave
- [x] publish / unpublish
- [x] mute / unmute video
- [x] mute / unmute audio
- [x] 摄像头、麦克风参数设置
- [x] 多人视频通话
- [x] 错误处理

## 使用技术

- 语言: `typescript`
- 框架: `react`
- 状态管理: `redux-toolkit`
- UI 组件库: `material-ui`
- 测试: `react-testing-library`
- 脚手架: `create-react-app`
- 音视频服务： `agora-rtc-sdk`
- 异步: `async/await`
- 表单: `formik`
- Styling: `styled-components`
- 本地存储: `localStorage`
- 代码格式化: `prettier`

## 本地应用启动

安装所有依赖包：

### `npm install`

启动应用：

### `npm start`

在以下地址打开应用：

[http://localhost:3000](http://localhost:3000)

## 测试

本地测试命令：

### `npm test`

## 已知问题

当用户加入 channel 之后有一定机率摄像头在另外用户的应用上没有默认开启，需要手动 unpublish/publish 来开启。
