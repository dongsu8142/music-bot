import { container, Listener } from "@sapphire/framework";
import { GuildQueue } from "discord-player";
import {
  GuildMember,
  GuildTextBasedChannel,
  PermissionsBitField,
} from "discord.js";

export class PlayerEvent extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options,
  ) {
    super(context, {
      ...options,
      emitter: container.client.player.events,
      event: "emptyQueue",
    });
  }

  public run(
    queue: GuildQueue<{
      channel: GuildTextBasedChannel;
      client: GuildMember;
      requestedBy: string;
    }>,
  ) {
    const resolved = new PermissionsBitField([
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ViewChannel,
    ]);
    const missingPerms = queue.metadata.channel
      .permissionsFor(queue.metadata.client)
      .missing(resolved);
    if (missingPerms.length) return;

    queue.metadata.channel
      .send("재생 목록이 비었습니다. 2분 후에 음성 채널을 나갑니다.")
      .then((m: { delete: () => void }) => setTimeout(() => m.delete(), 7000));
  }
}
