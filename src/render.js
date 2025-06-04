export const renderImage = (ctx, width, height) => {
    // Convert image to binary (purely black and white) for flipdot display
    {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // Apply thresholding - any pixel above 127 brightness becomes white (255), otherwise black (0)
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const binary = brightness > 127 ? 255 : 0;
            data[i] = binary; // R
            data[i + 1] = binary; // G
            data[i + 2] = binary; // B
            data[i + 3] = 255; // The board is not transparent :-)
        }
        ctx.putImageData(imageData, 0, 0);
    }
}