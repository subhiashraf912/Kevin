import { GuildMember, MessageAttachment } from "discord.js";

import Canvas from "canvas";
import Discord from "discord.js";
import Vibrant from "node-vibrant";
const Konva = require("konva/cmj").default;
import { registerFont } from "canvas";
registerFont("src/assets/fonts/tajawal.ttf", { family: "Tajawal" });
export default class WelcomeCardGenerator {
  member;
  attachment: MessageAttachment | undefined;

  constructor(member: GuildMember) {
    this.member = member;
  }

  async build() {
    const avatarx100 = await this.loadImage(
      this.member.user.displayAvatarURL({ format: "png", size: 96 })
    );
    const avatar = await this.loadImage(
      this.member.user.displayAvatarURL({ format: "png", size: 512 })
    );
    const palette = await Vibrant.from(
      this.member.user.displayAvatarURL({ format: "png", size: 96 })
    ).getPalette();

    const W = 1024,
      H = 330;
    const stage = new Konva.Stage({
      width: W,
      height: H,
    });
    const layer = new Konva.Layer();
    const bgGroup = new Konva.Group({
      shadowColor: "white",
      width: W,
      height: H,
    });
    const avatarBackground = new Konva.Image({
      x: -W / 3,
      y: -W * 0.6,
      image: avatarx100,
      width: W * 1.6,
      blurRadius: 70,
      height: W * 1.6,
    });
    avatarBackground.cache();
    avatarBackground.filters([Konva.Filters.Blur]);
    const border = new Konva.Rect({
      x: 0,
      y: 0,
      width: W,
      height: H,
      stroke: palette.LightVibrant?.getHex(),
      strokeWidth: 20,
    });
    bgGroup.add(avatarBackground);
    bgGroup.add(border);
    layer.add(bgGroup);
    const avatarWithMask = new Konva.Layer();
    const featherMask = new Konva.Circle({
      x: H / 2,
      y: H / 2,
      radius: H / 2,
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientStartRadius: 0,
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientEndRadius: H / 2,
      fillRadialGradientColorStops: [
        0,
        palette.DarkVibrant?.getHex(),
        0.3,
        palette.DarkVibrant?.getHex(),
        1,
        "transparent",
      ],
    });
    const avatarShow = new Konva.Image({
      x: 0,
      y: 0,
      width: H,
      height: H,
      image: avatar,
      globalCompositeOperation: "source-in",
    });
    avatarWithMask.add(featherMask);
    avatarWithMask.add(avatarShow);
    const welcomeMessageP1 = new Konva.Text({
      x: W / 3 + 40,
      y: H - 100,
      text: "Welcome",
      fontSize: 45,
      fontFamily: "Tajawal",
      fill: "#FFF",
      shadowColor: "#000",
      shadowBlur: 6,
      shadowOpacity: 2,
    });
    const welcomeMessageP2 = new Konva.Text({
      x: W / 3 + 70,
      y: H - 50,
      text: this.member.guild.name,
      fontSize: 35,
      fontFamily: "Tajawal",
      fill: "#FFF",
      shadowColor: "#000",
      shadowBlur: 6,
      shadowOpacity: 2,
    });
    const usernameText = new Konva.Text({
      x: W / 2.6,
      y: 70,
      width: 500,
      align: "center",
      text: this.member.nickname || this.member.user.username,
      fontSize: 45,
      fontFamily: "Tajawal",
      fill: "#FFF",
      shadowColor: "#000",
      shadowBlur: 6,
      shadowOpacity: 2,
      ellipsis: true,
      wrap: "none",
    });

    layer.add(welcomeMessageP1);
    layer.add(welcomeMessageP2);
    layer.add(usernameText);

    stage.add(layer);
    stage.add(avatarWithMask);
    layer.draw();

    const cvs = stage.toCanvas();
    this.attachment = new Discord.MessageAttachment(
      cvs.toBuffer(),
      `${Date.now()}-${this.member.id}-welcome.png`
    );
  }

  async getAttachment(): Promise<Discord.MessageAttachment> {
    if (!this.attachment) await this.build();
    return this.attachment as MessageAttachment;
  }
  async loadImage(src: string) {
    return await Canvas.loadImage(src);
  }
}
