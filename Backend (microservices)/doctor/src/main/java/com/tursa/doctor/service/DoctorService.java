package com.tursa.doctor.service;

import com.tursa.doctor.exception.DoctorNotFoundException;
import com.tursa.doctor.entity.Doctor;
import com.tursa.doctor.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor registerDoctor(Doctor doctor) throws ExecutionException, InterruptedException {
        return doctorRepository.save(doctor);
    }

    public Doctor getDoctor(String id) throws ExecutionException, InterruptedException {
        Doctor doctor = doctorRepository.findById(id);
        if (doctor == null) {
            throw new DoctorNotFoundException("Doctor not found with ID: " + id);
        }
        return doctor;
    }

    public List<Doctor> getAllDoctors() throws ExecutionException, InterruptedException {
        return doctorRepository.findAll();
    }

    public Doctor updateDoctor(String id, Doctor doctor) throws ExecutionException, InterruptedException {
        Doctor existing = doctorRepository.findById(id);
        if (existing == null) {
            throw new DoctorNotFoundException("Doctor not found with ID: " + id);
        }
        doctor.setDoctorId(id);
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String id) throws ExecutionException, InterruptedException {
        if (doctorRepository.findById(id) == null) {
            throw new DoctorNotFoundException("Doctor not found with ID: " + id);
        }
        doctorRepository.deleteById(id);
    }

    public Doctor loginDoctor(String email, String password) throws ExecutionException, InterruptedException {
        List<Doctor> doctors = doctorRepository.findByEmail(email);

        for (Doctor doctor : doctors) {
            if (doctor.getPassword().equals(password)) {
                return doctor; // Successful login
            }
        }
        return null; // Invalid credentials
    }
}