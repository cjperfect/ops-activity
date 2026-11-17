package com.activity.common.web.config;

import com.activity.common.web.GlobalExceptionHandler;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;

/**
 * common-web 自动装配。
 *
 * <p>业务应用的包名（com.activity.appmanage）扫不到 com.activity.common.web，
 * 所以必须通过自动配置把 Web 组件注册进容器；业务方依赖 common-web 即生效，无需 @Import。</p>
 */
@AutoConfiguration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
public class CommonWebAutoConfiguration {

    /** 全局异常处理；业务侧声明同名 bean 即可覆盖 */
    @Bean
    @ConditionalOnMissingBean(GlobalExceptionHandler.class)
    public GlobalExceptionHandler globalExceptionHandler() {
        return new GlobalExceptionHandler();
    }
}
