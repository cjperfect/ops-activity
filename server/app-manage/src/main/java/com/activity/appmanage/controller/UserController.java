package com.activity.appmanage.controller;

import com.activity.common.result.Result;
import com.activity.manageapi.client.UserClient;
import com.activity.manageapi.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserClient userClient;

    @RequestMapping("/list")
    public Result<List<UserVO>> list() {
        return Result.ok(userClient.list());
    }
}
