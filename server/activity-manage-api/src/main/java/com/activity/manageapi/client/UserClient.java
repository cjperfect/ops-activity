package com.activity.manageapi.client;

import com.activity.manageapi.vo.UserVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "user-server", path = "/api/user")
public interface UserClient {

    /**
     * 查询全部用户资料
     */
    @GetMapping("/list")
    List<UserVO> list();
}
