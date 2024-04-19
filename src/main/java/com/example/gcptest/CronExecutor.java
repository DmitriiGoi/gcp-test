package com.example.gcptest;


import net.dv8tion.jda.api.entities.Role;
import net.dv8tion.jda.api.entities.channel.middleman.MessageChannel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class CronExecutor {

    @Autowired
    private DiscordService discordService;

    @Scheduled(cron = "* * * * * *")
    public void cron() {
        List<Role> roles = discordService.getRoles();
        LocalDateTime truncatedTime = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        LocalDateTime next = truncatedTime.minusNanos(1);
        roles.stream()
                .filter(role -> role.getName().contains("cron"))
                .filter(role -> truncatedTime.equals(CronExpression.parse(parseCron(role.getName())).next(next))
                ).forEach(role -> {
            discordService.getUsersByRole(role).forEach(user -> {
                String channelName = parseChannelFromRoleName(role.getName());
                MessageChannel textChannel = discordService.getTextChannelByNameOrDefault(channelName);
                String suffix = StringUtils.isEmpty(channelName) ? " Заходишь в голосовй канал " + channelName + " блять." : "";
                textChannel.sendMessage("Чё " + user.getAsMention() + " блять. Ру сервер блять. Щас ножками топ топ топ к компу нахуй." + suffix + " В лолчик играть блять. Тык тык тык кнопочками блять. Вардилочки писечки юбочки блять. Намички блять, дианочки нахуй. Свиньи кабаны блять. Начнется ваше Ущелье призывателей блять. Лейнинг фаза НАХУЙ. Добивание крипочков блять, фарм голдишки сука. Моба плееры блять. Ебаные сука блять. Играют на своей хуйне блять. ПОРАЖЕНИЕ БЛЯТЬ.").queue();
            });
        });

    }

    private String parseCron(String roleName) {
        String split = roleName.split(";")[0];
        return split.replace("cron: ", "");
    }

    private String parseChannelFromRoleName(String roleName) {
        if (!roleName.contains(";")) {
            return null;
        }
        String split = roleName.split(";")[1];
        return split.replace("ch:", "");
    }
}
