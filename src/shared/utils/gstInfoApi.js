export const verifyGST = async (gstNumber) => {
  const apiUrl = "https://appyflow.in/api/verifyGST"; // API URL
  const keySecret = "GLvtebpRnzUTtopnWA1rJ5B2Oux1"; // Replace with your actual keySecret

  // Construct the body of the request
  const requestBody = {
    gstNo: gstNumber,
    key_secret: keySecret,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Convert the body object to JSON
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data
    return data;
  } catch (error) {
    console.error("Error verifying GST:", error);
    return { error: error.message };
  }
};
