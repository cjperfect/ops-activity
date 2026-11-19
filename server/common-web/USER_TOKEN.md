# 临时模拟用户 Token

Controller 参数添加 `@UserToken UserTokenInfo user`，请求携带：

```http
Authorization: Bearer dev-admin-token
```

当前固定映射为 `userId=1`、`username=admin`、`nickname=开发管理员`，不查询用户表。
该 Token 仅用于当前开发阶段模拟登录，不是 JWT，也不是 Nacos 登录凭证。
依赖 common-web 后自动注册参数解析器，只在使用该注解的接口上校验 Token。
缺少或错误 Token 按项目约定返回 HTTP 200、业务码 401。

活动保存接口使用示例：

```java
import com.activity.common.auth.UserTokenInfo;
import com.activity.common.web.annotation.UserToken;

@PostMapping("/saveOrUpdate")
public Result<Long> saveOrUpdate(@RequestBody ActivityBaseDTO dto,
                           @UserToken UserTokenInfo user) {
    return Result.ok(activityBaseService.saveOrUpdateActivityBase(dto, user.userId()));
}
```

Service 将 `user.userId()` 写入 `create_by` 和初始 `update_by`；更新时只更新 `update_by`，
不要接受前端传入的创建人，不增加负责人字段。
若接口经过 app-manage → Feign → activity-server，两边需要校验身份时，调用方还需显式传递 Authorization 请求头；本注解不会自动传播 Feign Header。

正式登录接入后，可提供自定义 `UserTokenArgumentResolver` Bean 替换固定映射，Controller 的注解用法保持不变。
