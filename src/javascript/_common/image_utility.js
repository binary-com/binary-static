const compressImg = (base64) => new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.drawImage(img, 0, 0);
        canvas.toBlob(resolve, 'image/jpeg', 0.80); // <----- set quality here
    };
});

const convertToBase64 = (blob) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        resolve(reader.result);
    };
});

const isLargeImg = img => ((img.buffer && img.buffer.byteLength >= 1.5 * 1024 * 1024));

const isPNG = filename => (filename.split('.').pop().toLowerCase() === 'png');

module.exports = {
    compressImg,
    convertToBase64,
    isLargeImg,
    isPNG,
};
