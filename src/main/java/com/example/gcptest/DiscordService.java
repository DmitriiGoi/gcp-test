package com.example.gcptest;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.entities.Role;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.middleman.MessageChannel;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscordService {

    private final JDA jda;
    @Value("${discord.guildid}")
    private String guildId;

    @Autowired
    DiscordService(JDA jda) {
        this.jda = jda;
    }

    public Role getOrCreateRole(String name) {
        Guild guild = jda.getGuildById(guildId);
        Proxy proxy = new Proxy();
        return guild.getRolesByName(name, true).stream().findFirst().orElseGet(() -> {
            guild.createRole().setName(name)
                    .setMentionable(true)
                    .queue(proxy::setValue);
            return (Role) proxy.getValue();
        });

    }

    public List<Member> getUsersByRole(Role role) {
        Guild guild = jda.getGuildById(guildId);
        return guild.findMembers(member -> {
            if (member.getRoles().contains(role)) {
                return true;
            }
            return false;
        }).get();
    }

    private class Proxy {
        public Object value;

        public Object getValue() {
            return value;
        }

        public void setValue(Object value) {
            this.value = value;
        }
    }

    public List<Role> getRoles() {
        Guild guild = jda.getGuildById(guildId);
        return guild.getRoles();
    }

    public MessageChannel getTextChannelByNameOrDefault(String channelName) {
        channelName = StringUtils.trim(channelName);
        Guild guild = jda.getGuildById(guildId);
        MessageChannel defaultTextChannel = guild.getDefaultChannel().asTextChannel();
        if (StringUtils.isEmpty(channelName)) {
            return defaultTextChannel;
        }
        List<MessageChannel> messageChannels = guild.getVoiceChannelsByName(channelName, true).stream().map(t -> (MessageChannel) t).collect(Collectors.toList());
        return messageChannels.stream().findFirst().orElse(defaultTextChannel);
    }

    public void createCommand() {
        Guild guild = jda.getGuildById(guildId);
        guild.upsertCommand("reg", "reg for role").addOption(OptionType.ROLE, "op1", "role to add", true).queue();
    }

    public void assignUserToRole(User user, Role role) {
        Guild guildById = jda.getGuildById(guildId);
        guildById.addRoleToMember(user, role).queue(t -> System.out.println(t));
    }

}
