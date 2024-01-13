import { Command } from "@sapphire/framework";
import { QueueRepeatMode, useQueue } from "discord-player";

const repeatModes = [
  { name: "끄기", value: QueueRepeatMode.OFF },
  { name: "노래", value: QueueRepeatMode.TRACK },
  { name: "재생목록", value: QueueRepeatMode.QUEUE },
  { name: "자동재생", value: QueueRepeatMode.AUTOPLAY },
];

export class LoopCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "반복",
      description: "현재 재생 중인 노래를 반복하거나 재생목록을 반복합니다.",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addNumberOption((option) =>
          option
            .setName("모드")
            .setDescription("모드를 선택해 주세요.")
            .setRequired(true)
            .addChoices(...repeatModes)
        );
    });
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const queue = useQueue(interaction.guild!.id);
    const permissions = this.container.client.perms.voice(interaction);

    if (!queue)
      return interaction.reply({
        content: "음성 채널에 있지 않습니다.",
        ephemeral: true,
      });
    if (!queue.currentTrack)
      return interaction.reply({
        content: `현재 노래를 재생 중이지 않습니다.`,
        ephemeral: true,
      });
    if (permissions.clientToMember()) return interaction.reply({ content: permissions.clientToMember(), ephemeral: true });

    const mode = interaction.options.getNumber("모드", true);
    const name =
      mode === QueueRepeatMode.OFF
        ? "반복"
        : repeatModes.find((m) => m.value === mode)?.name;

    queue.setRepeatMode(mode as QueueRepeatMode);

    return interaction.reply({
      content: `**${name}**을(를) **${
        mode === queue.repeatMode ? "활성화" : "비활성화"
      }**했습니다.`,
    });
  }
}
