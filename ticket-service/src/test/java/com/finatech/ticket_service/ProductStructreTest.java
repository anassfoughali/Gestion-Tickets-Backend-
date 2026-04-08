package com.finatech.ticket_service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class ProductStructreTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void validateProductTableColumns() throws Exception {
        Connection connection = dataSource.getConnection();
        DatabaseMetaData metaData = connection.getMetaData();

        String schema = "ZDEV_GP";
        String table = "MARISupportProduct";

        // === Colonnes attendues et types ===
        Map<String, Integer> expectedColumns = new HashMap<>();
        expectedColumns.put("PRODUCTID", Types.INTEGER);
        expectedColumns.put("PRODUCTNAME", Types.CLOB); // NCLOB in SAP HANA

        // === Récupérer les colonnes de la DB ===
        ResultSet columns = metaData.getColumns(null, schema, table, null);
        Map<String, Integer> dbColumns = new HashMap<>();
        while (columns.next()) {
            String colName = columns.getString("COLUMN_NAME").toUpperCase();
            int colType = columns.getInt("DATA_TYPE");
            dbColumns.put(colName, colType);
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
                boolean typesMatch = expectedType == actualType ||
                        (expectedType == Types.CLOB && actualType == -9); // NCLOB = -9 si jamais CLOB
                if (!typesMatch) {
                    System.out.println("❌ Column type mismatch for " + col +
                            ": expected " + expectedType +
                            ", found " + actualType);
                    allColumnsExist = false;
                } else {
                    System.out.println("✅ Column OK: " + col + " (" + actualType + ")");
                }
            }
        }

        // === Info clé primaire ===
        ResultSet pk = metaData.getPrimaryKeys(null, schema, table);
        Set<String> pkColumns = new HashSet<>();
        while (pk.next()) {
            pkColumns.add(pk.getString("COLUMN_NAME").toUpperCase());
        }
        System.out.println("ℹ Primary key columns: " + pkColumns);

        // === Info clé étrangère (facultative) ===
        ResultSet fk = metaData.getImportedKeys(null, schema, table);
        while (fk.next()) {
            String fkColumn = fk.getString("FKCOLUMN_NAME").toUpperCase();
            String pkTable = fk.getString("PKTABLE_NAME").toUpperCase();
            System.out.println("ℹ FK: " + fkColumn + " → " + pkTable);
        }

        assertTrue(allColumnsExist, "Database consistency check failed for Product!");
    }
}
