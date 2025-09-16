package com.pijieh.rtc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class HomepageController {

    @GetMapping("/")
    public String index() {
        return "html/index.html";
    }
}
