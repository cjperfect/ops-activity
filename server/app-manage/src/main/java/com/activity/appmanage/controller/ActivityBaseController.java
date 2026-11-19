package com.activity.appmanage.controller;

import com.activity.common.result.Result;
import com.activity.manageapi.client.ActivityBaseClient;
import com.activity.manageapi.vo.ActivityBaseVO;
import com.activity.manageapi.dto.ActivityBaseDTO;
import com.activity.common.auth.UserTokenInfo;
import com.activity.common.web.annotation.UserToken;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/activity-base")
public class ActivityBaseController {

    @Autowired
    private ActivityBaseClient activityBaseClient;

    @RequestMapping("/list")
    public Result<List<ActivityBaseVO>> list() {
        return Result.ok(activityBaseClient.listActivityBase());
    }

    /**
     * 新增或修改活动，Token 显式传递到活动服务。
     */
    @PostMapping("/saveOrUpdate")
    public Result<Boolean> saveOrUpdate(@Valid @RequestBody ActivityBaseDTO dto,
                                        @UserToken UserTokenInfo user,
                                        @RequestHeader("Authorization") String authorization) {
        return activityBaseClient.saveOrUpdateActivityBase(dto, authorization);
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id,
                                  @RequestHeader("Authorization") String authorization) {
        return activityBaseClient.deleteActivityBase(id, authorization);
    }
}
