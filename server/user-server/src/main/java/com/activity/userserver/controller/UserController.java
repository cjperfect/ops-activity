package com.activity.userserver.controller;

import com.activity.userapi.vo.UserVO;
import com.activity.userserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用户资料接口：既供小程序端访问，也供 app-manage 通过 OpenFeign 调用。
 * 使用 user-api 中的 DTO 作为跨服务响应，不对外暴露数据库实体。
 */
@RestController
@RequestMapping("/api/user")
public class UserController {


    @Autowired
    private UserService userService;

    /**
     * 查询用户列表
     */
    @GetMapping("/list")
    public List<UserVO> list() {
        return userService.listProfiles();
    }
}
