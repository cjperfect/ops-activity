package com.activity.manageapi.client;

import com.activity.common.result.Result;
import com.activity.manageapi.dto.UserDTO;
import com.activity.manageapi.vo.UserVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

/**
 * 用户服务 Feign 客户端。
 *
 * <p>{@code name} 是服务名，实际地址由消费方的
 * {@code spring.cloud.openfeign.client.config.user-server.url} 指定；
 * 接入 Nacos 后删掉该 url 配置即可走服务发现。</p>
 */
@FeignClient(name = "user-server", path = "/api/user")
public interface UserClient {

    /**
     * 查询全部用户资料
     */
    @GetMapping("/list")
    List<UserVO> list();
}
