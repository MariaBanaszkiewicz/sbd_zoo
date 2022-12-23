package com.example.sbd_zoo.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionHandler {

    private final String url = "jdbc:postgresql://localhost/zoo";
    private final String user = "postgres";
    private final String password = "1234";

    public Connection connection;

    public boolean connect() {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to the PostgreSQL server successfully.");
            connection = conn;
            return true;
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
