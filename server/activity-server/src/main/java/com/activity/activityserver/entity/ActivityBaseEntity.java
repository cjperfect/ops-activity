package com.activity.activityserver.entity;

import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 活动基础配置，对应 activity_base 表。
 * 字段使用项目配置的下划线转驼峰映射，创建和更新时间由数据库维护。
 */
@Data
@TableName("activity_base")
public class ActivityBaseEntity implements Serializable {

    /**
     * 主键（雪花 ID）。
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 活动编码，全局唯一，创建后不可修改或复用。
     */
    private String activityCode;

    /**
     * 活动名称。
     */
    private String activityName;

    /**
     * 活动封面图片地址。
     */
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String coverUrl;

    /**
     * 分享卡片标题。
     */
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String shareTitle;

    /**
     * 分享卡片图片地址。
     */
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String shareImageUrl;

    /**
     * 活动介绍，纯文本。
     */
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String description;

    /**
     * 开始时间，北京时间；草稿可为空。
     */
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private LocalDateTime startTime;

    /**
     * 结束时间（不含），北京时间；草稿可为空。
     */
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private LocalDateTime endTime;

    /**
     * 发布状态：0 草稿、1 已发布、2 已下线。
     */
    private Integer status;

    /**
     * 最近一次发布时间。
     */
    private LocalDateTime publishTime;

    /**
     * 最近一次下线时间，重新发布时清空。
     */
    private LocalDateTime offlineTime;

    /**
     * 内部备注，不向用户端展示。
     */
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String remark;

    /**
     * 创建人 ID，从请求 Token 中获取。
     */
    private Long createBy;

    /**
     * 最后修改人 ID，从请求 Token 中获取。
     */
    private Long updateBy;

    /**
     * 创建时间，由数据库默认值生成，不参与应用层写入。
     * NEVER：不把字段写进 SQL，由数据库维护时间。
     */
    @TableField(insertStrategy = FieldStrategy.NEVER, updateStrategy = FieldStrategy.NEVER)
    private LocalDateTime createTime;

    /**
     * 更新时间，由数据库 ON UPDATE CURRENT_TIMESTAMP 维护。
     * NEVER：不把字段写进 SQL，由数据库维护时间。
     */
    @TableField(insertStrategy = FieldStrategy.NEVER, updateStrategy = FieldStrategy.NEVER)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除：0 未删、1 已删。
     */
    @TableLogic(value = "0", delval = "1")
    private Integer deleted;
}
