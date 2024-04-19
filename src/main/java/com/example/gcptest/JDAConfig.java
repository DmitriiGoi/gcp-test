package com.example.gcptest;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.OnlineStatus;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.interactions.commands.Command;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.requests.GatewayIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class JDAConfig {

    @Value("${discord.api.token}")
    private String token;
    @Value("${discord.guildid}")
    private String guildId;
    @Autowired
    private MessageListener messageListener;


    @Bean
    public JDA jda() throws InterruptedException {
        JDA jda = JDABuilder.createLight(token)
                .addEventListeners(messageListener)
                .enableIntents(List.of(GatewayIntent.GUILD_MESSAGES,
                        GatewayIntent.GUILD_MEMBERS,
                        GatewayIntent.MESSAGE_CONTENT))
                .setStatus(OnlineStatus.ONLINE)
                .setActivity(Activity.watching("за твоей вежливостью"))
                .build().awaitReady();

        Guild guild = jda.getGuildById(guildId);
//        guild.upsertCommand("reg", "reg for notifications").addOption(OptionType.STRING, "cron", "role to add", true)
//                .addOption(OptionType.CHANNEL, "channel", "channel", false)
//                .queue();
//        List<Command> commands = guild.retrieveCommands().complete();
//        commands.stream().filter(t->t.getName().equals("reg")).forEach(t->guild.deleteCommandById(t.getId()).complete());

        return jda;
    }

}
