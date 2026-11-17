package com.activity.common.exception;

import com.activity.common.enums.ResultCode;
import com.activity.common.result.Result;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * BizException 行为校验：码值透传、文案覆盖、转统一返回体。
 */
class BizExceptionTest {

    @Test
    void should_use_default_message_of_result_code() {
        BizException ex = BizException.of(ResultCode.ACTIVITY_NOT_FOUND);
        assertEquals(10001, ex.getCode());
        assertEquals("活动不存在", ex.getMessage());
    }

    @Test
    void should_override_message() {
        BizException ex = BizException.of(ResultCode.ACTIVITY_CODE_DUPLICATED, "活动编码 BREO_202611 已存在");
        assertEquals(10002, ex.getCode());
        assertEquals("活动编码 BREO_202611 已存在", ex.getMessage());
    }

    @Test
    void should_default_to_bad_request_for_plain_message() {
        BizException ex = BizException.of("活动名称不能为空");
        assertEquals(400, ex.getCode());
    }

    @Test
    void should_convert_to_unified_result() {
        Result<Void> result = BizException.of(ResultCode.PRIZE_PROBABILITY_INVALID).toResult();
        assertEquals(20002, result.getCode());
        assertEquals("抽奖概率合计必须为 100%", result.getMessage());
    }
}
