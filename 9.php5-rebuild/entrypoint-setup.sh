#!/usr/bin/env bash

rm -rf /root/.ssh
mkdir /root/.ssh
cp /mnt/ssh/* /root/.ssh/
chmod 700 /root/.ssh
chmod 600 /root/.ssh/*

rm -rf /home/www-data/.ssh
mkdir /home/www-data/.ssh
cp /mnt/ssh/* /home/www-data/.ssh/
chmod 700 /home/www-data/.ssh
chmod 600 /home/www-data/.ssh/*
chown -R www-data:www-data /home/www-data/.ssh

/usr/local/bin/dns-regist.sh
/etc/init.d/blackfire-agent restart
