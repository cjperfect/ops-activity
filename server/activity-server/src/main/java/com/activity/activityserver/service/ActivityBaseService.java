package com.activity.activityserver.service;

import com.activity.manageapi.vo.ActivityBaseVO;
import com.activity.manageapi.dto.ActivityBaseDTO;
import com.activity.activityserver.entity.ActivityBaseEntity;
import com.baomidou.mybatisplus.spring.service.IService;

import java.util.List;

/**
 * 活动基础配置服务。
 */
public interface ActivityBaseService extends IService<ActivityBaseEntity> {

    /**
     * 查询全部活动列表
     */
    List<ActivityBaseVO> listActivityBase();

    /**
     * 新增草稿或更新已有的草稿、已下线活动；不存在的 ID 不会自动插入。
     */
    Boolean saveOrUpdateActivityBase(ActivityBaseDTO dto, Long userId);


    /**
     * 删除活动
     */
    Boolean removeById(Long id);
}
