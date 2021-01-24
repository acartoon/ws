$("#dropzone").dropzone({
    url: "post",
    maxFiles: 4,
    maxFilesize: 256,
    chunkSize: false,
    addRemoveLinks: true,
    acceptedFiles: 'image/*',
    previewTemplate: document.querySelector('#dropzone-template-container').innerHTML,
    previewsContainer: '.dropzone-block__files',
    createImageThumbnails: false,
});