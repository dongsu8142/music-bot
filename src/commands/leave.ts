import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";

export class DisconnectCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "나가",
      description: "음악을 멈추고 음성 채널을 나갑니다.",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder //
        .setName(this.name)
        .setDescription(this.description);
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
    if (permissions.clientToMember())
      return interaction.reply({
        content: permissions.clientToMember(),
        ephemeral: true,
      });

    queue.delete();
    return interaction.reply({
      content: `음성 채널을 성공적으로 나갔습니다.`,
    });
  }
}
