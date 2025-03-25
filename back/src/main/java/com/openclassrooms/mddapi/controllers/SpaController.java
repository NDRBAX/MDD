package com.openclassrooms.mddapi.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/", 
        "/topics"
    })
    public String forward() {
        return "forward:/index.html";
    }
}