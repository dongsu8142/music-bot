import { container, Listener } from '@sapphire/framework';
import { GuildQueue } from 'discord-player';
import { GuildMember, GuildTextBasedChannel, PermissionsBitField } from 'discord.js';

export class PlayerEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			emitter: container.client.player.events,
			event: 'emptyChannel'
		});
	}

	public run(queue: GuildQueue<{
        channel: GuildTextBasedChannel;
        client: GuildMember;
        requestedBy: string;
      }>) {
		const resolved = new PermissionsBitField([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]);
		const missingPerms = queue.metadata.channel.permissionsFor(queue.metadata.client).missing(resolved);
		if (missingPerms.length) return;

		queue.metadata.channel
			.send('음성 채널이 비어있습니다. 5분 후에 음성 채널을 나갔습니다.')
			.then((m: { delete: () => void }) => setTimeout(() => m.delete(), 15000));
	}
}