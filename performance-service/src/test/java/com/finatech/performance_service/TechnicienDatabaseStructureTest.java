package com.finatech.performance_service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import javax.sql.DataSource;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Database Structure Test for MARISupportGroup (Technicien) table
 * Validates that database schema matches entity expectations before runtime
 */
@SpringBootTest
public class TechnicienDatabaseStructureTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void validateTechnicienTableColumns() throws Exception {
        String schema = "ZDEV_GP";
        
        // Connect to database metadata
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        
        // Define expected schema based on MARISupportGroup table
        Map<String, Integer> expectedColumns = new HashMap<>();
        expectedColumns.put("GroupId", Types.INTEGER);
        expectedColumns.put("Description", Types.CLOB); // NCLOB in SAP HANA
        
        // Query actual schema - try unquoted table name
        Map<String, Integer> actualColumns = new HashMap<>();
        try (ResultSet columns = metaData.getColumns(null, schema, "MARISupportGroup", null)) {
            while (columns.next()) {
                String columnName = columns.getString("COLUMN_NAME");
                int columnType = columns.getInt("DATA_TYPE");
                actualColumns.put(columnName, columnType);
            }
        }
        
        // Validate table exists
        assertFalse(actualColumns.isEmpty(), 
            "Table MARISupportGroup not found in schema " + schema);
        
        // Validate each expected column exists and has correct type
        for (Map.Entry<String, Integer> expectedColumn : expectedColumns.entrySet()) {
            String columnName = expectedColumn.getKey();
            int expectedType = expectedColumn.getValue();
            
            assertTrue(actualColumns.containsKey(columnName), 
                "Column " + columnName + " should exist in table MARISupportGroup");
            
            int actualType = actualColumns.get(columnName);
            
            // Handle SAP HANA specific type mappings
            boolean typesMatch = expectedType == actualType ||
                (expectedType == Types.VARCHAR && actualType == 12) || // NVARCHAR in SAP HANA
                (expectedType == Types.CLOB && actualType == -9) || // NCLOB in SAP HANA
                (expectedType == Types.VARCHAR && actualType == -9) || // NCLOB for VARCHAR fields
                (expectedType == Types.INTEGER && actualType == 4); // INTEGER mapping
            
            assertTrue(typesMatch, 
                String.format("Column %s type mismatch. Expected: %d, Actual: %d", 
                    columnName, expectedType, actualType));
        }
        
        System.out.println("✓ Technicien table structure validation passed - " + 
                          actualColumns.size() + " columns validated");
    }
}
