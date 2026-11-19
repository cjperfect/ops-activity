package com.activity.manageapi.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/** 活动基础配置管理端响应，不包含数据库逻辑删除标记。 */
@Data
public class ActivityBaseVO {

    /** 活动 ID（雪花 ID）。 */
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Long id;

    /** 活动编码，创建后不可修改。 */
    private String activityCode;

    /** 活动名称。 */
    private String activityName;

    /** 活动封面图片地址。 */
    private String coverUrl;

    /** 分享卡片标题。 */
    private String shareTitle;

    /** 分享卡片图片地址。 */
    private String shareImageUrl;

    /** 活动介绍，纯文本。 */
    private String description;

    /** 开始时间，北京时间；草稿可为空。 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /** 结束时间（不含），北京时间；草稿可为空。 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    /** 发布状态：0 草稿、1 已发布、2 已下线，与按时间计算的运行阶段分开。 */
    private Integer status;

    /** 最近一次发布时间。 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime publishTime;

    /** 最近一次下线时间，重新发布时清空。 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime offlineTime;

    /** 内部备注，仅管理端可见。 */
    private String remark;

    /** 创建时间。 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /** 更新时间。 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}
