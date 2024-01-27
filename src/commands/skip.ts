import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";

export class SkipCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "스킵",
      description: "현재 노래를 건너뛰고 다음 노래를 자동으로 재생합니다",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description);
    });
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const queue = useQueue(interaction.guild!.id);
    const permissions = this.container.client.perms.voice(interaction);

    if (!queue)
      return interaction.reply({
        content: `음성 채널에 있지 않습니다.`,
        ephemeral: true,
      });
    if (!queue.currentTrack)
      return interaction.reply({
        content: `현재 노래를 재생 중이지 않습니다.`,
        ephemeral: true,
      });
    if (permissions.clientToMember())
      return interaction.reply({
        content: permissions.clientToMember(),
        ephemeral: true,
      });

    queue.node.skip();
    return interaction.reply({
      content: `노래를 스킵했습니다. 다음 노래를 재생합니다.`,
    });
  }
}
