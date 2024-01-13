import { container, Listener } from "@sapphire/framework";
import type { GuildQueue, Track } from "discord-player";
import {
  GuildMember,
  PermissionsBitField,
  GuildTextBasedChannel,
} from "discord.js";

export class PlayerEvent extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options
  ) {
    super(context, {
      ...options,
      emitter: container.client.player.events,
      event: "playerStart",
    });
  }

  public run(
    queue: GuildQueue<{
      channel: GuildTextBasedChannel;
      client: GuildMember;
      requestedBy: string;
    }>,
    track: Track
  ) {
    const resolved = new PermissionsBitField([
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ViewChannel,
    ]);
    const missingPerms = queue.metadata.channel
      .permissionsFor(queue.metadata.client)
      .missing(resolved);
    if (missingPerms.length) return;

    return queue.metadata.channel.send({
      embeds: [
        {
          author: { name: "노래를 재생합니다." },
          title: track.title,
          url: track.url,
          description: track.description,
          color: 0xaaaaff,
          thumbnail: {
            url: track.thumbnail,
          },
          fields: [
            {
              name: "재생 길이",
              value: track.duration,
              inline: true,
            },
            {
              name: "조회수",
              value: `${track.views}`,
              inline: true,
            },
            {
              name: "신청인",
              value: queue.metadata.requestedBy,
              inline: true,
            },
          ],
        },
      ],
    });
  }
}
