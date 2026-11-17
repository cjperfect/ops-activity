# 用户服务调用契约

`user-api` 是普通 Java 库，由 `user-server` 和调用方（如 `app-manage`）共同依赖。

- `client`：Feign 接口，由调用方注册并注入；服务端通过 Controller 提供对应 HTTP 接口，不实现 Feign 接口。
- `dto`：跨服务调用的请求、响应对象，由服务端与调用方共享。
- 数据库 Entity、Mapper 和业务实现保留在 `user-server`，不放入此模块。
- 各服务面向自身前端的 DTO、VO 放在各自模块。与跨服务响应完全一致时可直接复用 DTO，出现展示需求差异时再定义本地 VO 并转换。
- `common-core` 只保存 `Result` 等通用基础类型，不保存用户业务模型。

当前调用链：`app-manage.UserProxyController` → `user-api.UserClient` → `user-server.UserController`。
服务端将 `UserEntity` 转换为 `UserDTO`，管理端直接透传相同的数据结构。

新增或修改跨服务接口时，同步更新 Feign 路径、HTTP 方法、参数及服务端 Controller，保持契约一致。
