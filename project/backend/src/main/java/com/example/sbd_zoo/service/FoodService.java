package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Food;
import com.example.sbd_zoo.model.Serving;
import com.example.sbd_zoo.model.ServingId;
import com.example.sbd_zoo.repository.FoodRepository;
import com.example.sbd_zoo.repository.ServingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class FoodService {

    @Autowired
    FoodRepository foodRepository;

    @Autowired
    ServingRepository servingRepository;

    @Autowired
    ServingService servingService;

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
        food.setName(food.getName().substring(0,1).toUpperCase()+food.getName().substring(1).toLowerCase());
        food.setType(food.getType().substring(0,1).toUpperCase()+food.getType().substring(1).toLowerCase());
        food.setUnit(food.getUnit().toLowerCase());
        if (foodRepository.existsById(food.getName())){
            throw new DataIntegrityViolationException("Podane jedzenie znajduje się już w bazie.");
        } else {
            foodRepository.save(food);
        }
    }

    @Transactional
    public void updateFood(String id, Food food) {
        food.setName(food.getName().substring(0,1).toUpperCase()+food.getName().substring(1).toLowerCase());
        food.setType(food.getType().substring(0,1).toUpperCase()+food.getType().substring(1).toLowerCase());
        food.setUnit(food.getUnit().toLowerCase());
        Food old = foodRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("food not found on :: " + id));
        if (!Objects.equals(old.getName(), food.getName())){
            if (foodRepository.existsById(food.getName())){
                throw new DataIntegrityViolationException("Podane jedzenie znajduje się już w bazie.");
            } else {
                foodRepository.save(food);
                List<Serving> servings = servingRepository.findServingByFood(old.getName());
                for (Serving serving : servings) {
                    ServingId servingId = new ServingId();
                    servingId.setAnimal(serving.getAnimal());
                    servingId.setFood(serving.getFood());
                    serving.setFood(food.getName());
                    servingService.updateServing(servingId, serving);
                }
                deleteFood(id);
            }
        } else {
            old.setType(food.getType());
            old.setUnit(food.getUnit());
            foodRepository.save(old);
        }

    }

    @Transactional
    public void deleteFood(String id) {
        foodRepository.deleteById(id);
    }
}
