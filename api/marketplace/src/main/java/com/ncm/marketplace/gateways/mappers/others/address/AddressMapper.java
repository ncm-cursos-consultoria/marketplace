package com.ncm.marketplace.gateways.mappers.others.address;

import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.UpdateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.address.AddressResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class AddressMapper {
    public static Address toEntityCreate(CreateAddressRequest request) {
        return Address.builder()
                .country(request.getCountry())
                .state(request.getState())
                .city(request.getCity())
                .district(request.getDistrict())
                .zip(request.getZip())
                .street(request.getStreet())
                .number(request.getNumber())
                .addressLine2(request.getAddressLine2())
                .build();
    }

    public static AddressResponse toResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .country(address.getCountry())
                .state(address.getState())
                .city(address.getCity())
                .district(address.getDistrict())
                .zip(address.getZip())
                .street(address.getStreet())
                .number(address.getNumber())
                .addressLine2(address.getAddressLine2())
                .build();
    }

    public static Set<AddressResponse> toResponse(Set<Address> addresses) {
        return addresses.stream().map(AddressMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<AddressResponse> toResponse(List<Address> addresses) {
        return addresses.stream().map(AddressMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<AddressResponse> toResponse(Page<Address> addresses) {
        return addresses.map(AddressMapper::toResponse);
    }
}
