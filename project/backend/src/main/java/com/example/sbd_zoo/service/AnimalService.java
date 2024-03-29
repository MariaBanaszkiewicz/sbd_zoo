package com.example.sbd_zoo.service;

import com.example.sbd_zoo.repository.AnimalRepository;
import com.example.sbd_zoo.model.Animal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnimalService {

    @Autowired
    AnimalRepository animalRepository;

    @Transactional
    public List<Animal> getAllAnimals() {
        return animalRepository.findAll();
    }

    @Transactional
    public Animal getAnimal(Long id) {
        return animalRepository.findById(id).get();
    }

    @Transactional
    public void addAnimal(Animal animal) {
        animal.setName(animal.getName().substring(0,1).toUpperCase()+animal.getName().substring(1).toLowerCase());
        if (animal.getId() != null && animalRepository.existsById(animal.getId())){
            throw new DataIntegrityViolationException("Zwierzę o podanym id już istnieje.");
        } else {
            animalRepository.save(animal);
        }

    }

    @Transactional
    public void updateAnimal(Long id, Animal animal) {
        animal.setName(animal.getName().substring(0,1).toUpperCase()+animal.getName().substring(1).toLowerCase());
        Animal old = animalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Wybrane zwierzę nie znajduje się w bazie."));
        old.setName(animal.getName());
        old.setBirthDate(animal.getBirthDate());
        old.setZooDate(animal.getZooDate());
        old.setRun(animal.getRun());
        old.setSpecies(animal.getSpecies());
        old.setEmployee(animal.getEmployee());
        animalRepository.save(old);

    }

    @Transactional
    public void deleteAnimal(Long id) {
        animalRepository.deleteById(id);
    }

    @Transactional
    public List<Animal> getAnimalsOnRun(String run){
        return animalRepository.findByRun(run);
    }
}
