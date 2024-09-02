package com.example.gcptest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String main(Model model) {
        return "home";
    }

    @GetMapping("/design")
    public String design(Model model) {
        return "design";
    }

    @GetMapping("/champions")
    public String champions(Model model) {
        return "champions";
    }
}
