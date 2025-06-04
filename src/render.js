import { loadImage } from 'canvas';

export const renderImage = async (path, ctx, width, height) => {
    const image = await loadImage(path);
    ctx.drawImage(image, 0, 0, width, height);
}