const compressImg = (img) => new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.drawImage(img, 0, 0);
    canvas.toBlob(resolve, 'image/jpeg', 0.95); // <----- set quality here
});

const isImage = filename => (filename.split('.').pop().toLowerCase() === 'png');

module.exports = {
    compressImg,
    isImage,
};
