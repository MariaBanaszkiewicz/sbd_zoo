package com.example.sbd_zoo.serializer;

import com.example.sbd_zoo.model.Species;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class SpeciesSerializer extends StdSerializer<List<Species>> {

    public SpeciesSerializer() {
        this(null);
    }

    public SpeciesSerializer(Class<List<Species>> t) {
        super(t);
    }

    @Override
    public void serialize(
            List<Species> speciesList,
            JsonGenerator generator,
            SerializerProvider provider)
            throws IOException, JsonProcessingException {

        List<String> ids = new ArrayList<>();
        for (Species species : speciesList) {
            ids.add(species.getName());
        }
        generator.writeObject(ids);
    }
}
