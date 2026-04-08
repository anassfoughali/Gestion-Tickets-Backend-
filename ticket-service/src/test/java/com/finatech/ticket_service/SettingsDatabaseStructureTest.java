package com.finatech.ticket_service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class SettingsDatabaseStructureTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void validateSettingsTableColumns() throws Exception {
        Connection connection = dataSource.getConnection();
        DatabaseMetaData metaData = connection.getMetaData();

        String schema = "ZDEV_GP";
        String table = "MARISupportSettings";

        Map<String, Integer> expectedColumns = new HashMap<>();
        expectedColumns.put("ID", Types.INTEGER);
        expectedColumns.put("SETTING", Types.INTEGER);
        expectedColumns.put("DESCRIPTION", Types.CLOB); // NCLOB in SAP HANA

        ResultSet columns = metaData.getColumns(null, schema, table, null);
        Map<String, Integer> dbColumns = new HashMap<>();
        while (columns.next()) {
            dbColumns.put(columns.getString("COLUMN_NAME").toUpperCase(), columns.getInt("DATA_TYPE"));
        }

        boolean allColumnsExist = true;
        for (Map.Entry<String, Integer> entry : expectedColumns.entrySet()) {
            String col = entry.getKey();
            int expectedType = entry.getValue();
            if (!dbColumns.containsKey(col)) {
                System.out.println("❌ Missing column: " + col);
                allColumnsExist = false;
            } else {
                int actualType = dbColumns.get(col);
                if (!(expectedType == actualType || (expectedType == Types.CLOB && actualType == -9))) {
                    System.out.println("❌ Column type mismatch for " + col + ": expected " + expectedType + ", found " + actualType);
                    allColumnsExist = false;
                } else {
                    System.out.println("✅ Column OK: " + col + " (" + actualType + ")");
                }
            }
        }

        // Info PK
        ResultSet pk = metaData.getPrimaryKeys(null, schema, table);
        Set<String> pkColumns = new HashSet<>();
        while (pk.next()) pkColumns.add(pk.getString("COLUMN_NAME").toUpperCase());
        System.out.println("ℹ Primary key columns: " + pkColumns);

        assertTrue(allColumnsExist, "Database consistency check failed for Settings!");
    }
}