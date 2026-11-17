package com.activity.userserver.service;

import com.activity.userapi.vo.UserVO;
import com.activity.userserver.entity.UserEntity;
import com.baomidou.mybatisplus.spring.service.IService;

import java.util.List;

/**
 * 用户服务。
 */
public interface UserService extends IService<UserEntity> {

    /**
     * 查询全部用户资料
     */
    List<UserVO> listProfiles();
}
