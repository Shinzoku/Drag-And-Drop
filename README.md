# Secure Multi Upload with Drag and Drop

This project demonstrates a secure multi-file upload system with a drag-and-drop interface, image preview, deletion, and reordering functionality. It uses HTML, CSS, and JavaScript for the front-end, with added security measures to ensure only valid image files are accepted by checking the file's signature.

## Features

- Drag and drop images or use a file input to select multiple images.
- Preview selected images as thumbnails.
- Delete selected images if necessary.
- Reorder images by dragging the thumbnails.
- Client-side file type validation to ensure only images are uploaded by checking file signatures.

## Technologies Used

- HTML
- CSS
- JavaScript
- [SortableJS](https://sortablejs.github.io/Sortable/) for drag-and-drop sorting (Via CDN).

## Usage

1. Clone the repository or download the files.

    SSH
    ```bash
    git clone git@github.com:Shinzoku/Drag-And-Drop.git
    ```

    HTTPS
    ```bash
    git clone https://github.com/Shinzoku/Drag-And-Drop.git
    ```
2. Open `index.html` in a web browser.

## File Structure

```plaintext
votre-depot/
├── index.html
├── styles.css
├── script.js
├── LICENCE.txt
└── README.md
```

- `index.html`: Contains the HTML structure and includes the necessary scripts and styles.
- `styles.css`: Contains the CSS styles for the upload interface.
- `script.js`: Contains the JavaScript logic for handling file uploads, previews, deletion, reordering, and validation.
- `LICENCE.txt`: Contains the chosen license.
- `README.md`: Contains the informations and explacations project.

## Implementation Details

### HTML

- The HTML structure includes a container for file upload, a label with a hidden file input, and a drop area for drag-and-drop functionality.
- A preview container is used to display the image thumbnails.

### CSS

- Basic styles are provided for the upload container, drop area, and image previews.
- Styles ensure that the interface is user-friendly and visually appealing.

### JavaScript

- Event listeners are added to handle drag-and-drop events and file selection.
- The `SortableJS` library is used to enable reordering of image previews.
- The `handleFiles` function processes the selected files, checks their validity, and creates previews.
- The `isValidFileType` function reads the file's initial bytes to verify its MIME type and signature.
  - Valid signatures for JPEG, PNG, and GIF files are checked.
- Image previews include a delete button for removing selected images.
- Functions are defined to handle the drag-over, drag-leave, and drop events for the drop area.
- The script is loaded with the `defer` attribute to ensure it runs after the DOM is fully loaded.

### Security Measures

- Client-side validation of file types by checking the initial bytes of the file to ensure it matches known image signatures.
  - JPEG: `ffd8ffe0`, `ffd8ffe1`, `ffd8ffe2`, `ffd8ffe3`, `ffd8ffe8`
  - PNG: `89504e47`
  - GIF: `47494638`
- Validation prevents non-image files from being uploaded by checking their signatures.

## Customization

You can customize this project to support additional file types, including other image formats. Here's how you can do it:

### Adding Support for More Image Formats

To add support for more image formats, you need to update the `isValidFileType` function in `script.js` to include the new file signatures and MIME types.

#### Example: Adding BMP and WebP Image Support

1. Add the new MIME types to the `allowedTypes` array.
2. Add the corresponding file signatures to the `validSignatures` object.

```javascript
async function isValidFileType(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  const validSignatures = {
    'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
    'image/png': ['89504e47'],
    'image/gif': ['47494638'],
    'image/bmp': ['424d'],
    'image/webp': ['52494646']
  };

  const buffer = await file.slice(0, 4).arrayBuffer();
  const view = new DataView(buffer);
  const signature = view.getUint32(0, false).toString(16);

  for (let type in validSignatures) {
    if (validSignatures[type].includes(signature)) {
      return allowedTypes.includes(type);
    }
  }

  return false;
}
```

You can customize this project to switch from handling image files to handling text files such as `.doc`, `.docx`, and `.odt`. Here's how you can do it:

### Switching to Text Files

To switch from handling images to handling text files, you need to update the `isValidFileType` function in `script.js` to include the new file signatures and MIME types for text files. You will also need to update the preview creation logic to handle text files.

#### Example: Handling `.doc`, `.docx`, and `.odt` Files

1. Update the `allowedTypes` array and `validSignatures` object to include text file types.
2. Modify the `createFilePreview` function to display text file previews.

#### Updated `script.js` (Only the functions that change)

```javascript
async function handleFiles(files) {
    for (const file of files) {
        const isValid = await isValidFileType(file);
        if (isValid) {
        createFilePreview(file);
        } else {
            alert('Invalid file type! Please select a valid text document.');
        }
    }
}

async function isValidFileType(file) {
    const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text'];
    const validSignatures = {
        'application/msword': ['d0cf11e0'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['504b0304'],
        'application/vnd.oasis.opendocument.text': ['504b0304']
    };

    const buffer = await file.slice(0, 4).arrayBuffer();
    const view = new DataView(buffer);
    const signature = view.getUint32(0, false).toString(16);

    for (let type in validSignatures) {
        if (validSignatures[type].includes(signature)) {
        return allowedTypes.includes(type);
        }
    }

    return false;
}

function createFilePreview(file) {
    const previewFile = document.createElement('div');
    previewFile.classList.add('preview-file');
    previewFile.innerHTML = `
        <div class="file-icon">${getFileIcon(file.type)}</div>
        <div class="file-name">${file.name}</div>
        <div class="delete-button" onclick="deleteFile(this)">X</div>
    `;
    previewContainer.appendChild(previewFile);
}

// Allows you to put an image depending on the text file type
function getFileIcon(fileType) {
    switch (fileType) {
        case 'application/msword':
            return '📄'; // You can replace this with an appropriate icon
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return '📄'; // You can replace this with an appropriate icon
        case 'application/vnd.oasis.opendocument.text':
            return '📄'; // You can replace this with an appropriate icon
        default:
            return '📄'; // Default icon
    }
}
```

#### Updated `index.html`

```html
<input type="file" id="fileInput" multiple accept=".doc,.docx,.odt" style="display:none">
```

#### Updated `style.css`

```css
.preview-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #ddd;
    padding: 10px;
    margin: 5px 0;
}

.file-icon {
    font-size: 24px;
}

.file-name {
    flex: 1;
    margin-left: 10px;
}

.delete-button {
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
    padding: 5px;
}
```

## author

- **Nicolas Bernon**

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).