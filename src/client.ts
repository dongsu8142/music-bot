import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";
import * as Permissions from "./lib/perms";

export class BotClient extends SapphireClient {
  public player: Player;
  public perms: typeof Permissions;
  public constructor() {
    super({
      disableMentionPrefix: true,
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });
    this.perms = Permissions;
    this.player = new Player(this, {
      skipFFmpeg: false,
    });
  }
}

declare module "discord.js" {
  interface Client {
    readonly player: Player;
    readonly perms: typeof Permissions;
  }
}
