package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Task;
import com.example.sbd_zoo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    TaskRepository taskRepository;

    @Transactional
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional
    public Task getTask(Task id) {
        return taskRepository.findById(id).get();
    }

    @Transactional
    public void addTask(Task task) {
        if (taskRepository.existsById(task)){
            throw new DataIntegrityViolationException("Podane zadanie znajduje się już w bazie.");
        } else {
            taskRepository.save(task);
        }
    }

    @Transactional
    public void updateTask(Task id, Task task) {
        Task old = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        deleteTask(old);
        taskRepository.save(task);

    }

    @Transactional
    public void deleteTask(Task task) {
        taskRepository.deleteById(task);
    }

    @Transactional
    public List<Task> getEmployeeTasks(String employee){
        return taskRepository.findByEmployee(employee);
    }

    @Transactional
    public void transferTasks(String from, String to){
        taskRepository.transferTasks(from, to);
    }

}
