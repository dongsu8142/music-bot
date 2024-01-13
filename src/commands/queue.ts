import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { useQueue } from 'discord-player';

export class QueueCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
            name: "재생목록",
			description: '재생목록을 보여줍니다.'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description);
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const queue = useQueue(interaction.guild!.id);

		if (!queue) return interaction.reply({ content: `음성 채널에 있지 않습니다.`, ephemeral: true });
		if (!queue.tracks || !queue.currentTrack)
			return interaction.reply({ content: `표시할 재생목록이 없습니다`, ephemeral: true });

		let pagesNum = Math.ceil(queue.tracks.size / 5);
		if (pagesNum <= 0) pagesNum = 1;

		const tracks = queue.tracks.map((track, idx) => `**${++idx})** [${track.title}](${track.url})`);
		const paginatedMessage = new PaginatedMessage();

		// handle error if pages exceed 25 pages
		if (pagesNum > 25) pagesNum = 25;
		for (let i = 0; i < pagesNum; i++) {
			const list = tracks.slice(i * 5, i * 5 + 5).join('\n');

			paginatedMessage.addPageEmbed((embed) =>
				embed
					.setColor(0xaaaaff)
					.setDescription(
						`${list === '' ? '\n*• 재생목록이 비어있습니다.*' : `\n${list}`}
						\n**재생 중인 음악: 🎶 | **[${queue.currentTrack?.title}](${queue.currentTrack?.url})\n`
					)
					.setFooter({
						text: `${queue.tracks.size} track(s) in queue`
					})
			);
		}

		return paginatedMessage.run(interaction);
	}
}