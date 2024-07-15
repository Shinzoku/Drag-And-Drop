document.addEventListener('DOMContentLoaded', function () {
    // Get necessary elements from the DOM
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');

    // Add event listeners for drag and drop functionality
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // Initialize Sortable for the preview container
    new Sortable(previewContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost'
    });
    
    // Function to handle dragover event
    function handleDragOver(event) {
        event.preventDefault();
        dropArea.classList.add('drag-over');
    }

    // Function to handle dragleave event
    function handleDragLeave(event) {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
    }

    // Function to handle drop event
    function handleDrop(event) {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        handleFiles(files);
    }

    // Function to handle file selection using input
    function handleFileSelect() {
        const files = fileInput.files;
        handleFiles(files);
    }

    // Function to handle selected files
    async function handleFiles(files) {
        for (const file of files) {
            const isValid = await isValidFileType(file);
            if (isValid) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                createImagePreview(file, imageUrl);
            };
            reader.readAsDataURL(file);
            } else {
            alert('Invalid file type! Please select an image.');
            }
        }
    }

    // Function to check if the file type is valid
    async function isValidFileType(file) {
        // Define allowed MIME types for images
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        // File signature
        const validSignatures = {
            'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
            'image/png': ['89504e47'],
            'image/gif': ['47494638']
        };

        // allows you to read the first bytes of the file
        const buffer = await file.slice(0, 4).arrayBuffer();
        const view = new DataView(buffer);
        const signature = view.getUint32(0, false).toString(16);

        // Check if the file type is in the allowedTypes array and reads the first bytes of the file to verify its signature
        for (let type in validSignatures) {
            if (validSignatures[type].includes(signature)) {
                return allowedTypes.includes(type);
            }
        }

        return false;
    }
    
    // Function to create image preview and delete button
    function createImagePreview(file, imageUrl) {
        const previewImage = document.createElement('div');
        previewImage.classList.add('preview-image');
        previewImage.innerHTML = `
            <img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; max-height: 100%;">
            <p>${file.name}</p>
            <div style="margin: 4px; color: red;" class="delete-button" onclick="deleteImage(this)">X</div>
        `;
        previewContainer.appendChild(previewImage);
    }

    // Function to delete an image preview
    window.deleteImage = function (deleteButton) {
        const previewImage = deleteButton.parentElement;
        previewContainer.removeChild(previewImage);
    };
});
