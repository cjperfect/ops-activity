package com.activity.activityserver.controller;

import com.activity.activityserver.service.ActivityBaseService;
import com.activity.manageapi.vo.ActivityBaseVO;
import com.activity.manageapi.dto.ActivityBaseDTO;
import com.activity.common.auth.UserTokenInfo;
import com.activity.common.result.Result;
import com.activity.common.web.annotation.UserToken;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/activity-base")
public class ActivityBaseController {

    @Autowired
    private ActivityBaseService activityBaseService;

    /**
     * 获取所有活动列表
     */
    @GetMapping("/list")
    public List<ActivityBaseVO> list() {
        return activityBaseService.listActivityBase();
    }


    @PostMapping("/saveOrUpdate")
    public Result<Boolean> saveOrUpdate(@Valid @RequestBody ActivityBaseDTO dto,
                                        @UserToken UserTokenInfo user) {
        return Result.ok(activityBaseService.saveOrUpdateActivityBase(dto, user.userId()));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.ok(activityBaseService.removeById(id));
    }
}
