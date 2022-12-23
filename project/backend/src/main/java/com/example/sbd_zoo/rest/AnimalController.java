package com.example.sbd_zoo.rest;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import com.google.gson.Gson;
@RestController
public class AnimalController {
    private final Gson gson = new Gson();

    @GetMapping("/animals")
    public void getAnimals(){

    }
}
