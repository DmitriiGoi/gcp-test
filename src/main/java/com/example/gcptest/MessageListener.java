package com.example.gcptest;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Role;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Component;

//@Component
public class MessageListener extends ListenerAdapter {

//    @Autowired
//    @Lazy
    private DiscordService discordService;
//    @Autowired
//    @Lazy
    private JDA jda;
//    @Value("${discord.guildid}")
    private String guildId;


//    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
    }

//    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        if (event.getName().equals("reg")) {
            boolean cron = CronExpression.isValidExpression(event.getOption("cron").getAsString());
            if (!cron) {
                event.reply("Invalid cron");
            }
            OptionMapping channel = event.getOption("channel");
            String chString = channel != null && channel.getAsChannel() != null ? "; ch: " + channel.getAsChannel().getName() : "";
            Role role = discordService.getOrCreateRole("cron: " + event.getOption("cron").getAsString() + chString);
            discordService.assignUserToRole(event.getUser(), role);
            event.reply("You just added role: " + event.getOption("channel").getAsChannel().getName()).queue();
        }
        super.onSlashCommandInteraction(event);
    }
}
