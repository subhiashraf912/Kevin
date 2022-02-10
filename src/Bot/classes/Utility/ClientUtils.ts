import { PermissionString } from "discord.js";
import DiscordClient from "../Client/Client";
import pagination from "./Pagination";
import WelcomeCardGenerator from "./WelcomeCardGenerator";

class ClientUtils {
  client;
  pagination = pagination;
  constructor(client: DiscordClient) {
    this.client = client;
  }
  WelcomeCardGenerator = WelcomeCardGenerator;
  formatString(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  formatPermission(perm: PermissionString) {
    const str = perm.replaceAll("_", " ").toLowerCase();
    return this.formatString(str);
  }
  formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === "undefined") return "00:00";
    if (duration > 3600000000) return "Live";
    return this.convertTime(duration);
  }
  convertTime(duration: number) {
    let milliseconds = (duration % 1000) / 100,
      seconds: number | string = (duration / 1000) % 60,
      minutes: number | string = (duration / (1000 * 60)) % 60,
      hours: number | string = (duration / (1000 * 60 * 60)) % 24;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (duration < 3600000) {
      return minutes + ":" + seconds;
    } else {
      return hours + ":" + minutes + ":" + seconds;
    }
  }
  millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
    let h, m, s;
    h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
    m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);
    return `${h} Hours - ${m} Minutes - ${s} Secs`;
  };
}

export default ClientUtils;
