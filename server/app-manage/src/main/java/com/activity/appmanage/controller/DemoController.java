package com.activity.appmanage.controller;

import com.activity.common.result.Result;
import com.activity.userapi.client.UserClient;
import com.activity.userapi.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/demo")
@FeignClient("user-server")
public class DemoController {
    @Autowired
    private UserClient userClient;

    @GetMapping("/hello")
    public Result<List<UserVO>> hello() {
        List<UserVO> vos = userClient.list();
        return Result.ok(vos);
    }


}
