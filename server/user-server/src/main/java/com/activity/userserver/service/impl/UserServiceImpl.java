package com.activity.userserver.service.impl;

import com.activity.userapi.vo.UserVO;
import com.activity.userserver.entity.UserEntity;
import com.activity.userserver.mapper.UserMapper;
import com.activity.userserver.service.UserService;
import com.baomidou.mybatisplus.spring.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户服务实现。
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserEntity> implements UserService {

    private static final UserVO toVO(UserEntity user) {
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        return vo;
    }

    @Override
    public List<UserVO> listProfiles() {
        return list().stream().map(UserServiceImpl::toVO).toList();
    }


}
