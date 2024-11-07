package com.swp.hg.config;

public enum StatusClassAttendance {
    ABSENT(0), ATTEND(1);
    private final int value;
    StatusClassAttendance(int value) {
        this.value = value;
    }
    public int getValue() {
        return value;
    }
}
