package com.activity.manageapi.client;

import com.activity.manageapi.vo.ActivityBaseVO;
import com.activity.manageapi.dto.ActivityBaseDTO;
import com.activity.common.result.Result;
import org.springframework.web.bind.annotation.*;
import org.springframework.cloud.openfeign.FeignClient;

import java.util.List;

@FeignClient(name = "activity-server", path = "/api/activity-base")
public interface ActivityBaseClient {

    /**
     * 查询全部活动基础配置
     */
    @GetMapping("/list")
    List<ActivityBaseVO> listActivityBase();

    /**
     * 不带 ID 新增，带 ID 更新。
     */
    @PostMapping("/saveOrUpdate")
    Result<Boolean> saveOrUpdateActivityBase(@RequestBody ActivityBaseDTO dto,
                                             @RequestHeader("Authorization") String authorization);


    /**
     * 删除活动
     */
    @DeleteMapping("/{id}")
    Result<Boolean> deleteActivityBase(@PathVariable Long id,
                                       @RequestHeader("Authorization") String authorization);
}
