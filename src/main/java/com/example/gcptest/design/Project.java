package com.example.gcptest.design;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class Project {
    private long id;
    private String name;
    private byte[] baseImage;
    private List<Button> buttons = new CopyOnWriteArrayList<>();

    public Project(long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters and setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getBaseImage() {
        return baseImage;
    }

    public void setBaseImage(byte[] baseImage) {
        this.baseImage = baseImage;
    }

    public List<Button> getButtons() {
        return buttons;
    }
}
