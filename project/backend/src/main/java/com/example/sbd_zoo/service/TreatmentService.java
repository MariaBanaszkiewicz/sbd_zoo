package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Treatment;
import com.example.sbd_zoo.model.TreatmentId;
import com.example.sbd_zoo.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TreatmentService {

    @Autowired
    TreatmentRepository treatmentRepository;

    @Transactional
    public List<Treatment> getAllTreatments() {
        return treatmentRepository.findAll();
    }

    @Transactional
    public Treatment getTreatment(TreatmentId id) {
        return treatmentRepository.findById(id).get();
    }

    @Transactional
    public void addTreatment(Treatment treatment) {
        TreatmentId id = new TreatmentId();
        id.setAnimal(treatment.getAnimal());
        id.setDisease(treatment.getDisease());
        id.setDate(treatment.getDate());
        if (treatmentRepository.existsById(id)){
            throw new DataIntegrityViolationException("Podane leczenie znajduje się już w bazie.");
        } else {
            treatmentRepository.save(treatment);
        }
    }

    @Transactional
    public void updateTreatment(TreatmentId id, Treatment treatment) {
        Treatment old = treatmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Treatment not found"));
        old.setDate(treatment.getDate());
        old.setAnimal(treatment.getAnimal());
        old.setDisease(treatment.getDisease());
        old.setDescription(treatment.getDescription());
        treatmentRepository.save(old);

    }

    @Transactional
    public void deleteTreatment(Treatment treatment) {
        treatmentRepository.deleteById(treatment.id());
    }

    @Transactional
    public List<Treatment> getAnimalTreatments(Long animal){
        return treatmentRepository.findByAnimal(animal);
    }

}
