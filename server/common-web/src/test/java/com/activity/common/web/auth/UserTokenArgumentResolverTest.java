package com.activity.common.web.auth;

import com.activity.common.auth.UserTokenInfo;
import com.activity.common.result.Result;
import com.activity.common.web.annotation.UserToken;
import com.activity.common.web.config.CommonWebAutoConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.runner.WebApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserTokenArgumentResolverTest {

    private final WebApplicationContextRunner runner = new WebApplicationContextRunner()
            .withConfiguration(AutoConfigurations.of(CommonWebAutoConfiguration.class))
            .withUserConfiguration(TestWebConfiguration.class);

    @Test
    void autoConfigurationResolvesUserFromTokenAndIgnoresSuppliedUserId() {
        runner.run(context -> MockMvcBuilders.webAppContextSetup(context).build()
                .perform(get("/identity").header("Authorization", "Bearer dev-admin-token")
                        .param("userId", "999").param("username", "forged"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.username").value("admin")));
    }

    @Test
    void rejectsMissingOrInvalidTokenButLeavesUnannotatedEndpointsAlone() {
        runner.run(context -> {
            var mvc = MockMvcBuilders.webAppContextSetup(context).build();
            mvc.perform(get("/identity"))
                    .andExpect(status().isOk()).andExpect(jsonPath("$.code").value(401));
            for (String header : new String[]{"Bearer wrong-token", "dev-admin-token", "Basic dev-admin-token", "Bearer "}) {
                mvc.perform(get("/identity").header("Authorization", header))
                        .andExpect(status().isOk()).andExpect(jsonPath("$.code").value(401));
            }
            mvc.perform(get("/public"))
                    .andExpect(status().isOk()).andExpect(content().string("public"));
        });
    }

    @Configuration(proxyBeanMethods = false)
    @EnableWebMvc
    static class TestWebConfiguration {
        @Bean
        TestController testController() {
            return new TestController();
        }
    }

    @RestController
    static class TestController {
        @GetMapping("/identity")
        public Result<UserTokenInfo> identity(@UserToken UserTokenInfo user) {
            return Result.ok(user);
        }

        @GetMapping("/public")
        public String publicEndpoint() {
            return "public";
        }
    }
}
