import { Listener } from "@sapphire/framework";
import { useMainPlayer } from "discord-player";

export class UserEvent extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			once: true
		});
	}

  public async run() {
    this.container.logger.info(
      `Logged in as ${this.container.client.user?.username}`
    );

    const player = useMainPlayer();
    if (player) {
      await player.extractors.loadDefault((ext) => ext == "YouTubeExtractor");
    }
  }
}
