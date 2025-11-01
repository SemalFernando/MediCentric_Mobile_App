package com.tursa.technician.service;

import com.tursa.technician.exception.MedicalStaffNotFoundException;
import com.tursa.technician.model.LabTechnician;
import com.tursa.technician.repository.LabTechnicianRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class LabTechnicianService {
    private final LabTechnicianRepository labTechnicianRepository;

    public LabTechnicianService(LabTechnicianRepository labTechnicianRepository) {
        this.labTechnicianRepository = labTechnicianRepository;
    }

    public LabTechnician createLabTechnician(LabTechnician labTechnician) throws ExecutionException, InterruptedException {
        return labTechnicianRepository.save(labTechnician);
    }

    public LabTechnician getLabTechnician(String id) throws ExecutionException, InterruptedException {
        LabTechnician labTechnician = labTechnicianRepository.findById(id);
        if (labTechnician == null) {
            throw new MedicalStaffNotFoundException("Lab technician not found with ID: " + id);
        }
        return labTechnician;
    }

    public List<LabTechnician> getAllLabTechnicians() throws ExecutionException, InterruptedException {
        return labTechnicianRepository.findAll();
    }

    public LabTechnician updateLabTechnician(String id, LabTechnician labTechnician) throws ExecutionException, InterruptedException {
        LabTechnician existing = labTechnicianRepository.findById(id);
        if (existing == null) {
            throw new MedicalStaffNotFoundException("Lab technician not found with ID: " + id);
        }
        labTechnician.setLabTechnicianId(id);
        return labTechnicianRepository.save(labTechnician);
    }

    public void deleteLabTechnician(String id) throws ExecutionException, InterruptedException {
        if (labTechnicianRepository.findById(id) == null) {
            throw new MedicalStaffNotFoundException("Lab technician not found with ID: " + id);
        }
        labTechnicianRepository.deleteById(id);
    }

    public LabTechnician loginLabTechnician(String email, String password) throws ExecutionException, InterruptedException {
        List<LabTechnician> allTechnicians = labTechnicianRepository.findAll();
        for (LabTechnician t : allTechnicians) {
            if (t.getEmail().equals(email) && t.getPassword().equals(password)) {
                return t;
            }
        }
        return null; // invalid credentials
    }
}