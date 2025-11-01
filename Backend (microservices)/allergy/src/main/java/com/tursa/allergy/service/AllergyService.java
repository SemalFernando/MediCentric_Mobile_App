package com.tursa.allergy.service;

import com.tursa.allergy.entity.Allergy;
import com.tursa.allergy.repository.AllergyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class AllergyService {
    private final AllergyRepository allergyRepository;

    public AllergyService(AllergyRepository allergyRepository) {
        this.allergyRepository = allergyRepository;
    }

    public Allergy addAllergy(String patientId, Allergy allergy) throws ExecutionException, InterruptedException {
        allergy.setPatientId(patientId);
        allergyRepository.save(allergy);
        return allergy;
    }

    public List<Allergy> getPatientAllergies(String patientId) throws ExecutionException, InterruptedException {
        return allergyRepository.findByPatientId(patientId);
    }

    public Allergy updateAllergy(String id, Allergy allergy) throws ExecutionException, InterruptedException {
        Allergy existing = allergyRepository.findById(id);
        if (existing != null) {
            allergy.setAllergyId(id);
            allergy.setPatientId(existing.getPatientId());
            allergyRepository.save(allergy);
        }
        return allergy;
    }

    public void deleteAllergy(String id) throws ExecutionException, InterruptedException {
        allergyRepository.deleteById(id);
    }
}
