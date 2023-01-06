package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Food;
import com.example.sbd_zoo.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FoodService {

    @Autowired
    FoodRepository foodRepository;
    @Transactional
    public List<Food> getAllFood() {
        return foodRepository.findAll();
    }

    @Transactional
    public Food getFood(String id) {
        return foodRepository.findById(id).get();
    }

    @Transactional
    public void addFood(Food food) {
        if (foodRepository.existsById(food.getName())){
            throw new DataIntegrityViolationException("Podane jedzenie znajduje się już w bazie.");
        } else {
            foodRepository.save(food);
        }
    }

    @Transactional
    public void updateFood(String id, Food food) {
        Food old = foodRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("food not found on :: " + id));
        old.setName(food.getName());
        old.setType(food.getType());
        old.setUnit(food.getUnit());
        foodRepository.save(old);

    }

    @Transactional
    public void deleteFood(String id) {
        foodRepository.deleteById(id);
    }
}
