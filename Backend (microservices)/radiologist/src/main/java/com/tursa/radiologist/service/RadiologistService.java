package com.tursa.radiologist.service;

import com.tursa.radiologist.exception.MedicalStaffNotFoundException;
import com.tursa.radiologist.model.Radiologist;
import com.tursa.radiologist.repository.RadiologistRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RadiologistService {
    private final RadiologistRepository radiologistRepository;

    public RadiologistService(RadiologistRepository radiologistRepository) {
        this.radiologistRepository = radiologistRepository;
    }

    public Radiologist createRadiologist(Radiologist radiologist) throws ExecutionException, InterruptedException {
        return radiologistRepository.save(radiologist);
    }

    public Radiologist getRadiologist(String id) throws ExecutionException, InterruptedException {
        Radiologist radiologist = radiologistRepository.findById(id);
        if (radiologist == null) {
            throw new MedicalStaffNotFoundException("Radiologist not found with ID: " + id);
        }
        return radiologist;
    }

    public List<Radiologist> getAllRadiologists() throws ExecutionException, InterruptedException {
        return radiologistRepository.findAll();
    }

    public Radiologist updateRadiologist(String id, Radiologist radiologist) throws ExecutionException, InterruptedException {
        Radiologist existing = radiologistRepository.findById(id);
        if (existing == null) {
            throw new MedicalStaffNotFoundException("Radiologist not found with ID: " + id);
        }
        radiologist.setRadiologistId(id);
        return radiologistRepository.save(radiologist);
    }

    public void deleteRadiologist(String id) throws ExecutionException, InterruptedException {
        if (radiologistRepository.findById(id) == null) {
            throw new MedicalStaffNotFoundException("Radiologist not found with ID: " + id);
        }
        radiologistRepository.deleteById(id);
    }

    public Radiologist loginRadiologist(String email, String password) throws ExecutionException, InterruptedException {
        List<Radiologist> allRadiologists = radiologistRepository.findAll();
        for (Radiologist r : allRadiologists) {
            if (r.getEmail().equals(email) && r.getPassword().equals(password)) {
                return r;
            }
        }
        return null; // invalid credentials
    }
}