package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Task> {

    List<Task> findByEmployee(Integer employee);


    @Modifying
    @Query(value = "CALL przekaz_zadania(:od_prac,:do_prac);",nativeQuery = true)
    void transferTasks(@Param("od_prac") Integer from, @Param("do_prac") Integer to);
}
