package com.example.sbd_zoo.serializer;

import com.example.sbd_zoo.model.Climate;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ClimateSerializer extends StdSerializer<List<Climate>> {

    public ClimateSerializer() {
        this(null);
    }

    public ClimateSerializer(Class<List<Climate>> t) {
        super(t);
    }

    @Override
    public void serialize(
            List<Climate> climates,
            JsonGenerator generator,
            SerializerProvider provider)
            throws IOException, JsonProcessingException {

        List<String> ids = new ArrayList<>();
        for (Climate climate : climates) {
            ids.add(climate.getName());
        }
        generator.writeObject(ids);
    }
}
