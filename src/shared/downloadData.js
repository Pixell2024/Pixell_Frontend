export const downloadData = (data, headersForDownload, fileName) => {
  // Map the headers to corresponding object keys explicitly
  const headers = headersForDownload;
  const csvRows = [];

  // Add headers (only labels)
  csvRows.push(headers.map((header) => header.label).join(","));

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      // Accessing the property of the row based on the header key
      return row[header.key] || ""; // Fallback to an empty string if the key is not found
    });
    csvRows.push(values.join(","));
  });

  // Convert to CSV format
  const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvData);

  // Create a download link and trigger it
  const link = document.createElement("a");
  link.href = csvUrl;
  link.download = fileName || "table_data.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
