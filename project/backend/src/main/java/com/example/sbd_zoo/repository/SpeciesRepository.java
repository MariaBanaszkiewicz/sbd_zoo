package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, String> {
}
