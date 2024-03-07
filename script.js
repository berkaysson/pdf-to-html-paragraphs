// Function to handle file reader onload callback
const handleFileReaderLoad = async (event) => {
  const typedArray = new Uint8Array(event.target.result);
  try {
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    processPDF(pdf);
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
};

// Function to process the loaded PDF
const processPDF = async (pdf) => {
  const numPages = pdf.numPages;
  let pTags = "";

  // Iterate through each page
  for (let i = 1; i <= numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const extractedText = textContent.items.map((item) => item.str).join(" ");
      const paragraphs = extractedText.split(/\n\n+/);

      // Create <p> tags for each paragraph
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim() !== "") {
          pTags += `<p>${paragraph}</p>`;
        }
      });

      // Update loading bar progress
      const progress = (i / numPages) * 100;
      updateLoadingBar(progress);
    } catch (error) {
      console.error("Error processing page:", error);
    }
  }

  // Display <p> tags on the page
  document.getElementById("output").innerHTML = pTags;
};

// Function to handle file input change event
const loadPdf = (event) => {
  const file = event.target.files[0];
  const fileReader = new FileReader();

  // Set the onload callback function
  fileReader.onload = handleFileReaderLoad;

  fileReader.readAsArrayBuffer(file);
};

// Event listener for file input change
document.getElementById("fileInput").addEventListener("change", loadPdf);

const updateLoadingBar = (progress) => {
  const loadingBar = document.getElementById("loadingBar");
  loadingBar.value = progress;
};
