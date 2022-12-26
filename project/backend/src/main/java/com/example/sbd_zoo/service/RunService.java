package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Run;
import com.example.sbd_zoo.repository.RunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RunService {

    @Autowired
    RunRepository runRepository;

    @Transactional
    public List<Run> getAllRuns() {
        return runRepository.findAll();
    }

    @Transactional
    public Run getRun(String id) {
        return runRepository.findById(id).get();
    }

    @Transactional
    public void addRun(Run run) {
        runRepository.save(run);
    }

    @Transactional
    public void updateRun(Run run) {
        Run old = runRepository.findById(run.getName()).orElseThrow(() -> new ResourceNotFoundException("Run not found on :: " + run.getName()));
        old.setSize(run.getSize());
        old.setClimate(run.getClimate());
        runRepository.save(old);

    }

    @Transactional
    public void deleteRun(String id) {
        runRepository.deleteById(id);
    }
}
