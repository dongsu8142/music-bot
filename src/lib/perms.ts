import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
} from "discord.js";

export function voice(interaction: ChatInputCommandInteraction) {
  function client() {
    const resolved = new PermissionsBitField([
      PermissionsBitField.Flags.Connect,
      PermissionsBitField.Flags.Speak,
      PermissionsBitField.Flags.ViewChannel,
    ]);
    const missingPerms = (interaction.member as GuildMember).voice.channel
      ?.permissionsFor(interaction.guild!.members.me!)
      .missing(resolved)!;

    if (missingPerms.length)
      return `I am missing the required voice channel permissions: \`${missingPerms.join(
        ", ",
      )}\``;
  }

  function member(target?: GuildMember) {
    if (target && !target.voice.channel)
      return `${target.displayName} is not in a voice channel.`;
    if (!(interaction.member as GuildMember).voice.channel)
      return `$ou need to be in a voice channel.`;
  }

  function memberToMember(target: GuildMember) {
    if (
      (interaction.member as GuildMember).voice.channelId !==
      target.voice.channelId
    )
      return `You are not in the same voice channel as the **target user**.`;
  }

  function clientToMember() {
    if (
      interaction.guild?.members.me?.voice.channelId &&
      (interaction.member as GuildMember).voice.channelId !==
        interaction.guild?.members.me?.voice.channelId
    )
      return `You are not in my voice channel`;
  }

  return { client, member, memberToMember, clientToMember };
}
