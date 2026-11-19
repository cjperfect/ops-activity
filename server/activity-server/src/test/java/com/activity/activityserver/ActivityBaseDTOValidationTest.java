package com.activity.activityserver;

import com.activity.manageapi.dto.ActivityBaseDTO;
import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ActivityBaseDTOValidationTest {
    @Test
    void saveAllowsMissingIdAndPositiveIdButRejectsInvalidId() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            var dto = validDTO();
            assertTrue(validator.validate(dto).isEmpty());
            dto.setId(1L);
            assertTrue(validator.validate(dto).isEmpty());
            dto.setId(0L);
            assertFalse(validator.validate(dto).isEmpty());
            dto.setId(-1L);
            assertFalse(validator.validate(dto).isEmpty());
        }
    }

    @Test
    void saveStillValidatesCommonFields() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var dto = validDTO();
            dto.setActivityName("   ");
            assertTrue(factory.getValidator().validate(dto).stream()
                    .anyMatch(error -> error.getPropertyPath().toString().equals("activityName")));
        }
    }

    private ActivityBaseDTO validDTO() {
        var dto = new ActivityBaseDTO();
        dto.setActivityCode("VALIDATION_TEST");
        dto.setActivityName("校验测试");
        dto.setShareTitle("分享标题");
        dto.setStartTime(LocalDateTime.of(2030, 1, 1, 0, 0));
        dto.setEndTime(LocalDateTime.of(2030, 1, 2, 0, 0));
        return dto;
    }
}
