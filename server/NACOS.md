# 本地 Nacos 注册发现

## 启动

```bash
docker-compose up -d nacos
docker-compose ps nacos
```

本项目使用 Nacos 3.1.1 单机模式和独立数据卷。控制台：[http://127.0.0.1:18881](http://127.0.0.1:18881)。
仅绑定本机地址，已开启客户端、管理 API 与控制台鉴权。管理员账号为 `nacos`，随机密码保存在根目录 `config/nacos-local.properties` 中（已加入 Git 忽略规则，权限为 600）。

两个 Java 服务从 `./config/nacos-local.properties` 自动读取凭证，因此 IDEA 的 Working directory 应设为项目根目录。其他工作目录可通过环境变量 `NACOS_CREDENTIALS_FILE` 指定该文件的绝对路径。也可直接设置 `NACOS_USERNAME`、`NACOS_PASSWORD` 环境变量。修改凭证后重启应用。

`.env` 中的 `NACOS_AUTH_TOKEN` 是服务端签名密钥，不是控制台登录密码。改变本地凭证文件不会自动修改数据库中的管理员密码；以后请通过控制台修改密码，并同步更新本地文件。

| 用途 | 主机端口 |
| --- | --- |
| HTTP / 服务注册地址 | 8858 |
| 客户端 gRPC | 9858 |
| 控制台 | 18881 |

修改 HTTP 端口时，gRPC 主机端口必须保持为 HTTP 端口 + 1000。

重新加载 Maven，然后依次启动 `user-server`（8090）和 `app-manage`（8080）。
在控制台的 `public` 命名空间、`ACTIVITY_GROUP` 分组中应看到这两个服务。

```bash
curl http://127.0.0.1:8080/api/user/list
```

管理端通过 `@FeignClient(name = "user-server")` 获取注册实例并调用，已移除固定 URL。
确保运行环境没有另外设置 `spring.cloud.openfeign.client.config.user-server.url`，否则它会绕过服务发现。

## 应用参数

两个服务都支持以下环境变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| NACOS_SERVER_ADDR | 127.0.0.1:8858 | 注册中心 HTTP 地址 |
| NACOS_NAMESPACE | 空（public） | 自定义命名空间时填 ID，且需要先创建 |
| NACOS_GROUP | ACTIVITY_GROUP | 调用双方保持一致 |
| NACOS_DISCOVERY_IP | 127.0.0.1 | 注册的应用地址；默认适用于应用在本机运行 |
| APP_MANAGE_PORT | 8080 | 管理端监听端口 |
| USER_SERVER_PORT | 8090 | 用户服务监听端口 |

根目录 `.env` 由 Docker Compose 自动读取，IDEA 启动 Java 服务时不会自动读取。
从项目根目录运行时会自动加载本地凭证文件；需要覆盖时，在 IDEA Run Configuration 中设置环境变量。
应用部署到容器或其他主机时，必须配置彼此可达的注册地址和实例 IP。

当前仅接入服务注册发现，尚未接入 Nacos 配置中心。

参考：[Spring Cloud Alibaba 版本说明](https://sca.aliyun.com/docs/2025.x/overview/version-explain/)、[Nacos Docker 部署](https://nacos.io/docs/latest/quickstart/quick-start-docker/)。
