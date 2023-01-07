package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Food;
import com.example.sbd_zoo.model.Serving;
import com.example.sbd_zoo.model.ServingDetails;
import com.example.sbd_zoo.model.ServingId;
import com.example.sbd_zoo.repository.ServingRepository;
import jakarta.persistence.criteria.Join;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ServingService {

    @Autowired
    ServingRepository servingRepository;

    @Transactional
    public List<Serving> getAllServings() {
        return servingRepository.findAll();
    }

    @Transactional
    public Serving getServing(ServingId id) {
        return servingRepository.findById(id).get();
    }

    @Transactional
    public void addServing(Serving serving) {
        ServingId servingId = new ServingId();
        servingId.setAnimal(serving.getAnimal());
        servingId.setFood(serving.getFood());
        if (servingRepository.existsById(servingId)){
            throw new DataIntegrityViolationException("Podana porcja znajduje się już w bazie.");
        } else {
            servingRepository.save(serving);
        }
    }

    @Transactional
    public void updateServing(ServingId id, Serving serving) {
        Serving old = servingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Serving not found"));
        if (servingRepository.existsById(id)){
            throw new DataIntegrityViolationException("Podana porcja znajduje się już w bazie.");
        } else {
            deleteServing(id);
            servingRepository.save(serving);
        }

    }

    @Transactional
    public void deleteServing(ServingId serving) {
        servingRepository.deleteById(serving);
    }

    @Transactional
    public List<ServingDetails> getAnimalServings(Integer animal){
        List<ServingDetails> servings = new ArrayList<ServingDetails>();
        List<Object[]> objects = servingRepository.checkServings(animal);
        for (Object[] object : objects){
            ServingDetails servingDetails = new ServingDetails();
                servingDetails.setFood(String.valueOf(object[0]));
                servingDetails.setAmount((Integer) object[1]);
                servingDetails.setUnit(String.valueOf(object[2]));
            servings.add(servingDetails);
        }
        return servings;
    }

}
