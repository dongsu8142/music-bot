import { Command } from "@sapphire/framework";
import { QueryType, useMainPlayer } from "discord-player";
import type { GuildMember } from "discord.js";

type SearchEngine = (typeof QueryType)[keyof typeof QueryType];

export class PlayCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "재생",
      description: "음악을 재생합니다.",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) => {
          return option
            .setName("제목")
            .setDescription("노래 제목을 입력하세요.")
            .setRequired(true)
            .setAutocomplete(true);
        })
        .addStringOption((option) => {
          return option
            .setName("엔진")
            .setDescription("노래를 재생할 엔진을 선택해 주세요.")
            .addChoices(
              { name: "유튜브", value: QueryType.YOUTUBE_SEARCH },
              { name: "스포티파이", value: QueryType.SPOTIFY_SEARCH },
              { name: "애플 뮤직", value: QueryType.APPLE_MUSIC_SEARCH },
              { name: "사운드클라우드", value: QueryType.SOUNDCLOUD_SEARCH },
            );
        });
    });
  }

  public override async autocompleteRun(
    interaction: Command.AutocompleteInteraction,
  ) {
    const engine = interaction.options.getString("엔진") as SearchEngine | null;
    const query = interaction.options.getString("제목");
    if (!query) return [];

    const player = useMainPlayer();

    const results = await player.search(query, {
      requestedBy: interaction.user,
      fallbackSearchEngine: engine ? engine : QueryType.YOUTUBE_SEARCH,
    });

    let tracks;
    tracks = results.tracks
      .map((t) => ({
        name: `${t.title} by ${t.author}`,
        value: t.url,
      }))
      .slice(0, 10);

    if (results.playlist) {
      tracks = results!.tracks
        .map(() => ({
          name: `${results.playlist!.title} [playlist]`,
          value: results.playlist!.url,
        }))
        .slice(0, 1);
    }

    return interaction.respond(tracks).catch(() => null);
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const player = useMainPlayer();
    const member = interaction.member as GuildMember;
    const permissions = this.container.client.perms.voice(interaction);
    if (permissions.member())
      return interaction.reply({
        content: permissions.member(),
        ephemeral: true,
      });
    if (permissions.client())
      return interaction.reply({
        content: permissions.client(),
        ephemeral: true,
      });

    const engine = interaction.options.getString("엔진") as SearchEngine | null;
    const query = interaction.options.getString("제목");

    if (permissions.clientToMember())
      return interaction.reply({
        content: permissions.clientToMember(),
        ephemeral: true,
      });
    await interaction.deferReply();
    const results = await player.search(query!, {
      requestedBy: interaction.user,
      fallbackSearchEngine: engine ? engine : QueryType.YOUTUBE_SEARCH,
    });

    if (!results.hasTracks())
      return interaction.editReply({
        content: `노래를 찾지 못 했습니다.`,
      });

    try {
      await player.play(member.voice.channel!.id, results, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            client: interaction.guild?.members.me,
            requestedBy: interaction.user.username,
          },
          leaveOnEmptyCooldown: 300000,
          leaveOnEndCooldown: 120000,
          leaveOnEmpty: true,
          leaveOnEnd: true,
          pauseOnEmpty: true,
          volume: 100,
        },
      });

      return interaction.deleteReply();
    } catch (error: any) {
      await interaction.editReply({ content: `An **error** has occurred` });
      return console.log(error);
    }
  }
}
