package com.activity.activityserver.service.impl;

import com.activity.activityserver.entity.ActivityBaseEntity;
import com.activity.activityserver.mapper.ActivityBaseMapper;
import com.activity.activityserver.service.ActivityBaseService;
import com.activity.manageapi.vo.ActivityBaseVO;
import com.activity.manageapi.dto.ActivityBaseDTO;
import com.activity.common.enums.ResultCode;
import com.activity.common.exception.BizException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import com.baomidou.mybatisplus.spring.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class ActivityBaseServiceImpl extends ServiceImpl<ActivityBaseMapper, ActivityBaseEntity> implements ActivityBaseService {

    private static final ActivityBaseVO toVO(ActivityBaseEntity activityBaseEntity) {
        ActivityBaseVO vo = new ActivityBaseVO();
        BeanUtils.copyProperties(activityBaseEntity, vo);
        return vo;
    }

    @Override
    public List<ActivityBaseVO> listActivityBase() {
        LambdaQueryWrapper<ActivityBaseEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(ActivityBaseEntity::getCreateTime).eq(ActivityBaseEntity::getDeleted, 0);
        return list(queryWrapper).stream().map(ActivityBaseServiceImpl::toVO).toList();
    }


    @Override
    @Transactional
    public Boolean saveOrUpdateActivityBase(ActivityBaseDTO dto, Long userId) {
        // 校验时间是否合法
        if (dto.getStartTime() == null || dto.getEndTime() == null) {
            throw new BizException(ResultCode.ACTIVITY_TIME_INVALID, "开始时间或结束时间不能为空");
        }
        // 开始时间必须早于结束时间
        if (!dto.getStartTime().isBefore(dto.getEndTime())) {
            throw new BizException(ResultCode.ACTIVITY_TIME_INVALID, "开始时间必须早于结束时间");
        }

        if (dto.getId() == null) {
            // 新增
            ActivityBaseEntity activityBaseEntity = new ActivityBaseEntity();
            BeanUtils.copyProperties(dto, activityBaseEntity, "id");
            activityBaseEntity.setCreateBy(userId);
            activityBaseEntity.setUpdateBy(userId);
            return save(activityBaseEntity);
        }
        // 更新
        // 先去查询当前这个id的活动是否存在
        ActivityBaseEntity activityBaseEntity = getById(dto.getId());
        if (Objects.isNull(activityBaseEntity)) {
            throw new BizException(ResultCode.ACTIVITY_NOT_FOUND, "活动不存在");
        }
        // 根据id更新活动信息
        BeanUtils.copyProperties(dto, activityBaseEntity, "id");
        activityBaseEntity.setUpdateBy(userId);
        return updateById(activityBaseEntity);
    }


    @Override
    @Transactional
    public Boolean removeById(Long id) {
        // 逻辑删除，更新删除时间字段
        ActivityBaseEntity activityBaseEntity = getById(id);
        log.info("删除活动，id={}", id);
        if (Objects.isNull(activityBaseEntity)) {
            throw new BizException(ResultCode.ACTIVITY_NOT_FOUND, "活动不存在");
        }
        return super.removeById(id);
    }
}
