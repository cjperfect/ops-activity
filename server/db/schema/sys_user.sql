-- =============================================================
-- 运营活动 · C 端用户表（仅保留用户基础信息）
-- 约定：主键雪花 ID（MyBatis-Plus ASSIGN_ID），逻辑删除字段 deleted，
--       时间字段由 MySQL 维护，业务代码不手工赋值。
-- =============================================================
CREATE TABLE sys_user (
    id              BIGINT       NOT NULL                COMMENT '主键（雪花 ID）',
    openid          VARCHAR(64)  NOT NULL                COMMENT '微信小程序 openid，登录唯一标识',
    unionid         VARCHAR(64)  DEFAULT NULL            COMMENT '微信 unionid，用于小程序/公众号/H5 多端打通',
    phone           VARCHAR(20)  DEFAULT NULL            COMMENT '手机号，授权后解密写入',
    nickname        VARCHAR(64)  DEFAULT NULL            COMMENT '昵称',
    avatar_url      VARCHAR(512) DEFAULT NULL            COMMENT '头像地址',
    gender          TINYINT      NOT NULL DEFAULT 0      COMMENT '性别：0 未知 1 男 2 女',
    status          TINYINT      NOT NULL DEFAULT 1      COMMENT '状态：1 正常 0 禁用 -1 已注销',
    register_source TINYINT      NOT NULL DEFAULT 1      COMMENT '注册来源：1 小程序 2 公众号 3 H5',
    last_login_time DATETIME     DEFAULT NULL            COMMENT '最近登录时间',
    create_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted         TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除：0 未删 1 已删',
    PRIMARY KEY (id),
    UNIQUE KEY uk_openid (openid),
    UNIQUE KEY uk_phone (phone),
    KEY idx_unionid (unionid),
    KEY idx_create_time (create_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci COMMENT = 'C 端用户（小程序会员）';

-- -------------------------------------------------------------
-- 测试数据（仅本地/测试环境使用，生产环境请勿执行）
-- -------------------------------------------------------------
INSERT INTO sys_user (id, openid, unionid, phone, nickname, avatar_url, gender, status, register_source, last_login_time)
VALUES (1, 'oTestOpenid_0001', 'uTestUnionid_0001', '13800138000', '陈江', NULL, 1, 1, 1, NOW());
