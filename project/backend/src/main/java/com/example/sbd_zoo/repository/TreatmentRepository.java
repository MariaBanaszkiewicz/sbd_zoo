package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Treatment;
import com.example.sbd_zoo.model.TreatmentID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, TreatmentID> {

    List<Treatment> findByAnimal(Long animal);
}
