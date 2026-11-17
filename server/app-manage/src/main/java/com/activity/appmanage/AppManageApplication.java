package com.activity.appmanage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import com.activity.manageapi.client.UserClient;

@SpringBootApplication
@EnableFeignClients(clients = UserClient.class)
public class AppManageApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppManageApplication.class, args);
    }

}
