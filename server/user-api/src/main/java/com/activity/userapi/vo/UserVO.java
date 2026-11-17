package com.activity.userapi.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class UserVO {

    /**
     * 主键（雪花 ID）
     */
    private Long id;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像地址
     */

    private String avatarUrl;

    /**
     * 性别：0 未知 1 男 2 女
     */
    private Integer gender;

    /**
     * 状态：1 正常 0 禁用 -1 已注销
     */
    private Integer status;

    /**
     * 注册来源：1 小程序 2 公众号 3 H5
     */
    private Integer registerSource;

    /**
     * 最近登录时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastLoginTime;

    /**
     * 创建时间，由数据库默认值维护
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间，由数据库自动更新
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}
