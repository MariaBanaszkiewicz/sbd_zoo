package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Climate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClimateRepository extends JpaRepository<Climate, String> {
}
