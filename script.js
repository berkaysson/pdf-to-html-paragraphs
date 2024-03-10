// Function to handle file reader onload callback
const handleFileReaderLoad = async (event) => {
  const typedArray = new Uint8Array(event.target.result);
  try {
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    const pageNumberInput = document.getElementById("pageNumberInput");
    const startPage = parseInt(pageNumberInput.value, 10) || 1;
    processPDF(pdf, startPage);
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
};

// Function to process the loaded PDF
const processPDF = async (pdf, startPage) => {
  const numPages = pdf.numPages;
  let pTags = "";

  // Iterate through each page
  for (let i = startPage; i <= numPages; i++) {
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
      const progress = ((i - startPage + 1) / (numPages - startPage + 1)) * 100;
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

document.addEventListener("DOMContentLoaded", () => {
  const lastPageNumber = localStorage.getItem("lastPageNumber");
  if (lastPageNumber) {
    const pageNumberInput = document.getElementById("pageNumberInput");
    pageNumberInput.value = lastPageNumber;
  }
});

document.getElementById("pageNumberInput").addEventListener("change", (event) => {
  const pageNumber = event.target.value;
  localStorage.setItem("lastPageNumber", pageNumber);
});

const updateLoadingBar = (progress) => {
  const loadingBar = document.getElementById("loadingBar");
  loadingBar.value = progress;
};

// Function to handle reset button click event
const resetPdf = () => {
  document.getElementById("output").innerHTML = '<p>Başlangıç</p>';
  document.getElementById("fileInput").value = null;
  updateLoadingBar(0);
};

// Event listener for reset button click
document.getElementById("resetButton").addEventListener("click", resetPdf);
