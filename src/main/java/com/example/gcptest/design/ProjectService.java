package com.example.gcptest.design;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ProjectService {

    private final List<Project> projects = new ArrayList<>();
    private final AtomicLong projectIdCounter = new AtomicLong();
    private final AtomicLong buttonIdCounter = new AtomicLong();

    public List<Project> getAllProjects() {
        return projects;
    }

    public Project createProject(String name) {
        Project project = new Project(projectIdCounter.incrementAndGet(), name);
        projects.add(project);
        return project;
    }

    public Project findProjectById(long projectId) {
        return projects.stream()
                .filter(p -> p.getId() == projectId)
                .findFirst()
                .orElse(null);
    }

    public void setProjectBaseImage(long projectId, MultipartFile image) throws IOException {
        Project project = findProjectById(projectId);
        if (project != null && image != null && !image.isEmpty()) {
            project.setBaseImage(image.getBytes());
        }
    }

    public byte[] getProjectBaseImage(long projectId) {
        Project project = findProjectById(projectId);
        return project != null ? project.getBaseImage() : null;
    }

    public Button addProjectButton(long projectId, String name, float x, float y, MultipartFile photo) throws IOException {
        Project project = findProjectById(projectId);
        if (project != null) {
            byte[] photoData = photo != null && !photo.isEmpty() ? photo.getBytes() : null;
            Button button = new Button(buttonIdCounter.incrementAndGet(), name, x, y, photoData);
            project.getButtons().add(button);
            return button;
        }
        return null;
    }

    public boolean deleteButton(long projectId, long buttonId) {
        Project project = findProjectById(projectId);
        project.getButtons().stream().filter(t -> t.getId() == buttonId).findFirst().ifPresent(t -> project.getButtons().remove(t));
        return true;
    }
}
