package com.example.sbd_zoo.rest;

public class Error {
    private String errorMessage;
    public Error(String message){
        errorMessage = message;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
