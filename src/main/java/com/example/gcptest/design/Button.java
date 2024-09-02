package com.example.gcptest.design;

public class Button {
    private long id;
    private String name;
    private float x;
    private float y;
    private byte[] photoData;  // Store image data as bytes

    public Button(long id, String name, float x, float y, byte[] photoData) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.photoData = photoData;
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

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public byte[] getPhotoData() {
        return photoData;
    }

    public void setPhotoData(byte[] photoData) {
        this.photoData = photoData;
    }
}
