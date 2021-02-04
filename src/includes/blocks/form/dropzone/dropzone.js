function initDropzone(params) {
    params.el.dropzone({
        url: "post",
        maxFiles: params.maxFiles,
        maxFilesize: params.maxFilesize,
        chunkSize: false,
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        previewTemplate: params.previewTemplate,
        previewsContainer: params.previewsContainer,
        createImageThumbnails: false,
    });

    // $("#dropzone").dropzone({
    //     url: "post",
    //     maxFiles: 4,
    //     maxFilesize: 256,
    //     chunkSize: false,
    //     addRemoveLinks: true,
    //     acceptedFiles: 'image/*',
    //     previewTemplate: document.querySelector('#dropzone-template-container').innerHTML,
    //     previewsContainer: '.dropzone-block__files',
    //     createImageThumbnails: false,
    // });
}
