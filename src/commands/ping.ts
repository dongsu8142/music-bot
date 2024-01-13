import { Command } from "@sapphire/framework";

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "핑",
      description: "레이턴시를 보여줍니다",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description);
    });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const ping = Math.round(this.container.client.ws.ping);
    return interaction.reply({ content: `현재 레이턴시: ${ping}ms` });
  }
}
