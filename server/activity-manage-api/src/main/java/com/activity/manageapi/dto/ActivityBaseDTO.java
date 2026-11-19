package com.activity.manageapi.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 活动新增、修改共用入参；状态和创建人由服务端维护。
 */
@Data
public class ActivityBaseDTO {
    /**
     * 新增时为空；修改时传入已有活动 ID，使用字符串传输以保留雪花 ID 精度。
     */
    @Positive(message = "活动ID必须为正数")
    private Long id;

    @NotBlank(message = "活动编码不能为空")
    @Pattern(regexp = "[a-zA-Z0-9_-]{1,64}", message = "活动编码需为1至64位字母、数字、下划线或连字符")
    private String activityCode;

    @NotBlank(message = "活动名称不能为空")
    @Size(max = 128, message = "活动名称不能超过128个字符")
    private String activityName;

    @Size(max = 512, message = "活动封面地址不能超过512个字符")
    private String coverUrl;

    @NotNull(message = "分享标题不能为空")
    @Size(max = 40, message = "分享标题不能超过40个字符")
    private String shareTitle;

    @Size(max = 512, message = "分享图片地址不能超过512个字符")
    private String shareImageUrl;

    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;

    @Size(max = 500, message = "备注不能超过500个字符")
    private String remark;

}
