
package com.example.test.exception;

public class UserBannedException extends RuntimeException {
    public UserBannedException() {
        super("User is banned");
    }
}
