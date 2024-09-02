package com.example.gcptest.design;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestParam("name") String name,
            @RequestParam("image") MultipartFile image) throws IOException {
        if (image.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Project project = projectService.createProject(name);
        projectService.setProjectBaseImage(project.getId(), image);
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @GetMapping("/{projectId}/base-image")
    public ResponseEntity<byte[]> getBaseImage(@PathVariable long projectId) {
        byte[] baseImageData = projectService.getProjectBaseImage(projectId);
        if (baseImageData != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "image/jpeg"); // Adjust as needed
            return new ResponseEntity<>(baseImageData, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{projectId}/buttons")
    public ResponseEntity<Button> addProjectButton(
            @PathVariable long projectId,
            @RequestParam String name,
            @RequestParam float x,
            @RequestParam float y,
            @RequestParam("photo") MultipartFile photo) throws IOException {
        Button button = projectService.addProjectButton(projectId, name, x, y, photo);
        return button != null ? new ResponseEntity<>(button, HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{projectId}/buttons")
    public ResponseEntity<List<Button>> getProjectButtons(@PathVariable long projectId) {
        Project project = projectService.findProjectById(projectId);
        if (project != null) {
            return new ResponseEntity<>(project.getButtons(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{projectId}/buttons/{buttonId}")
    public ResponseEntity<Void> deleteButton(@PathVariable long projectId, @PathVariable long buttonId) {
        boolean deleted = projectService.deleteButton(projectId, buttonId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/{projectId}/buttons/{buttonId}/jpg")
    public @ResponseBody
    byte[] getImage(@PathVariable long projectId, @PathVariable long buttonId) throws IOException {
        Project project = projectService.findProjectById(projectId);
        return project.getButtons().stream().filter(t -> t.getId() == buttonId).findFirst().get().getPhotoData();

    }
}
