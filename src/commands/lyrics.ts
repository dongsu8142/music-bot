import { lyricsExtractor } from "@discord-player/extractor";
import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";
import { EmbedBuilder } from "discord.js";

const genius = lyricsExtractor();

export class LyricsCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "가사",
      description: "지정된 노래의 가사를 표시합니다",
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
            .setDescription("검색할 가사의 트랙을 입력하세요");
        });
    });
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const queue = useQueue(interaction.guild!.id);
    const track =
      interaction.options.getString("제목") ||
      (queue?.currentTrack?.title as string);
    const lyrics = await genius.search(track).catch(() => null);

    if (!lyrics)
      return interaction.reply({
        content: `이 노래는 가사가 없습니다`,
        ephemeral: true,
      });
    const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

    const embed = new EmbedBuilder()
      .setTitle(lyrics.title)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setAuthor({
        name: lyrics.artist.name,
        iconURL: lyrics.artist.image,
        url: lyrics.artist.url,
      })
      .setDescription(
        trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics
      )
      .setColor("Yellow");

    return interaction.reply({ embeds: [embed] });
  }
}
