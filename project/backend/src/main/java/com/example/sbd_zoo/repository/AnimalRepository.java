package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findByRun(String run);

    List<Animal> findBySpecies(String species);

    List<Animal> findAnimalByEmployee(String employee);

}
