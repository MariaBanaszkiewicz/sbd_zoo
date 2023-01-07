package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Task;
import com.example.sbd_zoo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class TaskController {

    @Autowired
    TaskService taskService;

    @GetMapping("/tasks")
    public<T> T getTasks() {
        try {
            List<Task> listOfTasks = taskService.getAllTasks();
            return (T) listOfTasks;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać zadań.");
        }

    }

    @PostMapping("/tasks")
    public ResponseEntity postTask(@RequestBody Task Task) {
        try {
            taskService.addTask(Task);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać zadania.");
        }
    }

    @PutMapping("/task/{emp}+{desc}")
    public ResponseEntity updateTask(@PathVariable(value = "emp") String emp, @PathVariable(value = "desc") String desc, @RequestBody Task task) {
        try {
            Task id = new Task();
            id.setEmployee(emp);
            id.setDescription(desc);
            taskService.updateTask(id, task);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować zadania.");
        }
    }

    @DeleteMapping("/tasks")
    public ResponseEntity deleteTask(@RequestBody Task task){
        try {
            taskService.deleteTask(task);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć zadania.");
        }
    }
}
