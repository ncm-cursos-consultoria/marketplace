package com.ncm.marketplace.domains.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PlansEnum {
    BASIC("BASIC"),
    STANDARD("STANDARD"),
    PREMIUM("PREMIUM");

    private final String name;

    public static PlansEnum fromName(String name) {
        for (PlansEnum permission : PlansEnum.values()) {
            if (permission.getName().equalsIgnoreCase(name)) {
                return permission;
            }
        }
        throw new IllegalArgumentException("Invalid name: " + name);
    }
}
