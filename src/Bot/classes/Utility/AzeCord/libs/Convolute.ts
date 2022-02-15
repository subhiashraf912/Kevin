import Canvas from "canvas";
import convolute from "../plugins/convolute";

export default async (
  img: string | Buffer,
  matrix: any[],
  opaque: boolean,
  lvl: number = 0
) => {
  if (isNaN(lvl)) lvl = 1;
  const image = await Canvas.loadImage(img);
  const canvas = Canvas.createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  for (let i = 0; i < lvl; i++) {
    convolute(ctx, canvas, matrix, opaque);
  }

  return canvas.toBuffer();
};
