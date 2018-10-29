const compressImg = (image) => new Promise((resolve) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            const filename = image.filename.replace(/\.[^/.]+$/, '.jpg');
            const file = new File([blob], filename, {
                type            : 'image/jpeg',
                lastModifiedDate: Date.now(),
            });
            resolve(file);
        }, 'image/jpeg', 0.9); // <----- set quality here
    };
});

const convertToBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const result = { src: reader.result, filename: file.name };
        resolve(result);
    };
});

const isLargeImg = img => ((img.buffer && img.buffer.byteLength >= 2 * 1024 * 1024));

const isImageType = filename => (/\.(gif|jpg|jpeg|tiff|png)$/i).test(filename);

module.exports = {
    compressImg,
    convertToBase64,
    isLargeImg,
    isImageType,
};
