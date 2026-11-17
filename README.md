# 运营活动小程序（activity）

「小程序 C 端 + 管理后台」的运营活动系统：运营在管理后台配置活动与奖品，用户在小程序端参与活动、抽奖、兑换。

---

## 一、项目内容

### 管理后台（admin）

面向运营人员，核心是**活动配置**：

| 模块 | 内容 |
| --- | --- |
| 活动列表 | 活动编码、名称、时间、状态，操作入口 |
| 活动配置弹窗 | 单弹窗完成配置，不跳转独立页面 |
| 基础信息 | 活动编码、活动名称、活动开始/结束时间 |
| 分享配置 | 分享标题、分享图片 |
| 兑换奖品 | 奖品列表（可增删） |
| 抽奖奖品 | 奖品列表 + 中奖概率，合计必须 = 100% |
| 奖品类型 | 实物奖品、虚拟奖品、优惠券、第三方奖品 |

交互约定：底部只有「提交」，无「保存草稿」；点击遮罩不关闭弹窗。

### 小程序端（规划）

微信登录 → 活动详情 → 参与/抽奖 → 奖品兑换 → 核销，对应 `user-server` 的 C 端接口。

---

## 二、整体架构

```
┌──────────────┐        HTTP         ┌──────────────────┐
│  admin 管理台 │ ──────────────────▶ │  app-manage 8080 │
│ React + Vite │                     │    管理端服务     │
└──────────────┘                     └────────┬─────────┘
                                              │ OpenFeign（user-api 契约）
┌──────────────┐        HTTP         ┌────────▼─────────┐
│ 小程序 C 端   │ ──────────────────▶ │  user-server 8090│
└──────────────┘                     │    C 端服务      │
                                     └────────┬─────────┘
                                              │ MyBatis-Plus
                                     ┌────────▼─────────┐
                                     │   MySQL 8.4      │
                                     └──────────────────┘

异步层（后续规划）：
app-manage / user-server ──publish──▶ RabbitMQ ──consume──▶ 非主业务消费者
```

- 管理端与 C 端是**两个独立可执行服务**，各自端口、各自数据库连接。
- 服务间通过 OpenFeign 调用，接口契约集中在 `user-api` 模块。
- 公共能力（返回体、异常、全局处理）沉在 `common-*`，业务服务只依赖不重复实现。
- 主链路（配置保存、抽奖、兑换）保持同步；**操作日志、统计看板、缓存刷新、消息通知等非主业务**通过 RabbitMQ 异步处理，避免拖慢主流程。

---

## 三、前端架构（admin）

### 技术栈

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · shadcn/ui（基于 `@base-ui/react`）· React Router 7

### 目录分层

```
admin/src/
├── components/
│   ├── layout/          # 侧边栏、侧边栏状态 Context、顶栏
│   └── ui/              # shadcn 基础组件（dialog/select/table/input…）
├── features/
│   └── activity/        # 业务域
│       ├── activity-list-page.tsx     # 活动列表页
│       ├── activity-config-dialog.tsx # 活动配置弹窗（核心）
│       ├── types.ts                   # 领域类型
│       ├── lib.ts                      # 校验/工具函数（概率合计等）
│       └── mock-data.ts                # 当前 mock 数据
├── lib/utils.ts         # cn() 等通用工具
├── App.tsx              # 页面装配
└── main.tsx             # 入口
```

### 分层原则

- **`components/ui` 只做通用展示**，不含业务逻辑，便于替换与复用。
- **`features/activity` 承载业务**：类型 → 校验函数 → 列表页 → 配置弹窗，同域文件放在一起。
- **页面与弹窗分离**：列表页只负责展示与触发，配置表单全部收敛在 `activity-config-dialog.tsx`。
- 当前数据来自 `mock-data.ts`，后续替换为 `app-manage` 的 REST 接口，表单结构与类型无需改动。

---

## 四、后端架构（server）

### 技术栈

Spring Boot 4.1.2 · JDK 17 · Spring Cloud 2025.1.4（OpenFeign）· MyBatis-Plus 3.5.18 · MySQL 8.4 · Maven 多模块
（后续规划：Spring AMQP + RabbitMQ 异步消息）

### 模块划分

| 模块 | 类型 | 职责 |
| --- | --- | --- |
| `common-core` | 普通 jar | 统一返回体 `Result`、业务码 `ResultCode`、业务异常 `BizException` |
| `common-web` | 普通 jar | `GlobalExceptionHandler` + 自动装配，向业务服务提供统一异常处理 |
| `user-api` | 普通 jar | 服务契约：`UserDTO`/`UserVO` + `UserClient`（Feign 接口） |
| `common-mq`（规划） | 普通 jar | 消息封装：统一消息体、`RabbitTemplate` 发送、消费幂等与死信约定 |
| `app-manage` | 可执行服务 :8080 | 管理端接口：活动配置、奖品配置、活动列表 |
| `user-server` | 可执行服务 :8090 | C 端接口：用户资料、活动参与、抽奖、兑换 |

### 依赖层次

```
        app-manage        user-server
             │                 │
             ├──── user-api ───┤        （接口契约，双方共用）
             │                 │
             └──── common-web ─┘
                      │
                 common-core
```

- 依赖**单向向下**，`common-*` 不反向依赖任何业务模块。
- `user-api` 只放 DTO/VO 与 Feign 接口，不放实现，服务方与调用方共用同一份定义。
- 公共库是普通 jar，可执行服务才打 Spring Boot 可执行包。

### 统一返回与异常

Controller 只返回 `Result<T>`：

```json
{ "code": 0, "message": "操作成功", "data": { } }
```

- `code = 0` 成功；`400/401/403/404/500` 通用错误；`10001+` 活动域业务错误。
- Service 校验失败直接 `throw BizException.of(ResultCode.XXX)`。
- `common-web` 统一兜底 `BizException`、参数校验、404、未知异常，业务模块无需再写错误处理。

### 服务间调用（OpenFeign）

```
app-manage ──UserClient(Feign)──▶ user-server /api/user/*
```

- 契约在 `user-api`，调用方加 `@EnableFeignClients`，服务方只提供 Controller。
- `user-api` 对 Feign 运行时依赖设为 optional，避免服务提供方被动引入 Feign。
- 当前用固定 `url` 配置直连，后续接 Nacos 只删配置、不改代码。
- 跨服务只传 DTO/VO，不返回数据库实体。

### 异步消息（规划）

主链路只做必要同步写库，其余「非主业务更新」通过 RabbitMQ 解耦：

```
业务服务 ──(本地事务提交后 publish)──▶ Exchange ──路由──▶ Queue ──▶ 消费者
```

| 事件 | 生产者 | 消费者职责 |
| --- | --- | --- |
| `activity.config.changed` | app-manage | 刷新活动配置缓存、同步到小程序端可用配置 |
| `prize.stock.changed` | user-server | 库存对账、预警 |
| `draw.record.created` | user-server | 写中奖流水、更新数据看板 |
| `redeem.order.created` | user-server | 生成核销单、推送订阅消息 |
| `operation.log` | app-manage / user-server | 统一落操作日志表 |

设计约定：

- **事务后发送**：主业务写库成功、事务提交后再投递，避免"消息发了但数据回滚"；关键场景用本地消息表兜底。
- **消费者幂等**：以业务唯一键（活动编码 + 用户 ID + 业务单号）去重，保证重复投递不重复扣减。
- **失败可控**：手动 ack + 有限重试 + 死信队列，消费失败不影响主链路。
- **消息体统一**：`common-mq` 提供统一 envelope（事件类型、业务主键、时间戳、traceId），各服务只关心 payload。
- 异步只承载**可延迟、可补偿**的更新；库存扣减、奖品发放等强一致动作仍在主链路同步完成。

### 持久层

- MyBatis-Plus：`Mapper extends BaseMapper`，`Service extends IService` / `ServiceImpl`。
- 实体只做表映射（`@TableName`、`@TableId`、`@TableLogic`），校验注解放在入参 DTO。
- 当前表：`sys_user`（openid、昵称、头像、手机号、性别、状态、注册来源、逻辑删除）。
