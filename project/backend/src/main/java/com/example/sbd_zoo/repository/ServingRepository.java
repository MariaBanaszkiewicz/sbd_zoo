package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Food;
import com.example.sbd_zoo.model.Serving;
import com.example.sbd_zoo.model.ServingDetails;
import com.example.sbd_zoo.model.ServingId;
import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.SqlResultSetMapping;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServingRepository extends JpaRepository<Serving, ServingId> {
    @Procedure(value = "sprawdz_jadlospis")
    List<Object[]> checkServings(@Param ("id_zw") Integer animal);


}
