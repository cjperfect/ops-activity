-- =============================================================
-- 活动基础配置（由 activity-server 管理）
-- 主键：MyBatis-Plus ASSIGN_ID；时间统一使用北京时间。
-- create_time / update_time 由 MySQL 维护。
-- 本脚本仅建表，不包含活动参与、奖品、抽奖、报名等业务配置。
-- =============================================================
CREATE TABLE activity_base (
    id              BIGINT       NOT NULL                COMMENT '主键（雪花 ID）',
    activity_code   VARCHAR(64)  NOT NULL                COMMENT '活动编码，全局唯一，创建后不可修改或复用',
    activity_name   VARCHAR(128) NOT NULL                COMMENT '活动名称',
    cover_url       VARCHAR(512) DEFAULT NULL            COMMENT '活动封面图片地址',
    share_title     VARCHAR(40)  DEFAULT NULL            COMMENT '分享卡片标题，发布时必填',
    share_image_url VARCHAR(512) DEFAULT NULL            COMMENT '分享卡片图片地址，发布时必填',
    description     TEXT                                 COMMENT '活动介绍，纯文本',
    start_time      DATETIME     DEFAULT NULL            COMMENT '活动开始时间，草稿可为空',
    end_time        DATETIME     DEFAULT NULL            COMMENT '活动结束时间（不含），草稿可为空',
    status          TINYINT      NOT NULL DEFAULT 0      COMMENT '发布状态：0 草稿 1 已发布 2 已下线',
    publish_time    DATETIME     DEFAULT NULL            COMMENT '最近一次发布时间',
    offline_time    DATETIME     DEFAULT NULL            COMMENT '最近一次下线时间，重新发布时清空',
    remark          VARCHAR(500) DEFAULT NULL            COMMENT '内部备注，不向用户端展示',
    create_by       BIGINT       DEFAULT NULL            COMMENT '创建人 ID，管理端身份体系接入前可为空',
    update_by       BIGINT       DEFAULT NULL            COMMENT '最后修改人 ID',
    create_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted         TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除：0 未删 1 已删',
    PRIMARY KEY (id),
    UNIQUE KEY uk_activity_code (activity_code),
    KEY idx_deleted_create (deleted, create_time, id),
    KEY idx_deleted_status_create (deleted, status, create_time, id),
    CONSTRAINT chk_activity_base_status CHECK (status IN (0, 1, 2)),
    CONSTRAINT chk_activity_base_deleted CHECK (deleted IN (0, 1)),
    CONSTRAINT chk_activity_base_time CHECK (
        start_time IS NULL OR end_time IS NULL OR end_time > start_time
    ),
    CONSTRAINT chk_activity_base_publish CHECK (
        status <> 1 OR (start_time IS NOT NULL AND end_time IS NOT NULL AND publish_time IS NOT NULL)
    )
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci COMMENT = '活动基础配置';

-- 业务约定（由应用层实现）：
-- 1. 创建时为草稿；名称、编码必须非空白，编码建议只允许字母、数字、下划线、连字符。
--    编码比较不区分大小写，逻辑删除后也不复用，避免旧链接指向其他活动。
-- 2. 草稿可编辑；已发布活动应先下线再编辑；已下线活动允许编辑并重新发布。
-- 3. 发布时检查封面、分享标题、分享图片、介绍、起止时间等必填项，且 end_time > 当前时间。
--    可以在活动开始后发布；若已过结束时间，应先调整时间再发布。
-- 4. 发布时设置 publish_time 并清空 offline_time；下线时设置 offline_time。
-- 5. 仅草稿和已下线活动允许逻辑删除；发布、下线、删除需使用带原状态条件的更新，避免并发覆盖。
-- 6. 运行阶段不持久化：当前时间 < start_time 为未开始；
--    start_time <= 当前时间 < end_time 为进行中；当前时间 >= end_time 为已结束。
--    用户端只展示 deleted = 0 且 status = 1 的活动，并根据阶段决定是否允许参与。
-- 7. create_by / update_by 从登录身份获取，不接受前端自行指定。
