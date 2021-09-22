#!/bin/bash

MULTIPASS=`multipass ls | grep primary | grep Running` #起動状態を表示
echo $MULTIPASS
if [ -z "$MULTIPASS" ]; then #停止状態
    multipass start primary #起動
fi

# /etc/hostsへ「multipass-host」という名称でmultipassのIP登録
MULTIPASS_HOST_IP=`multipass ls | grep primary | awk '{print $3}'`
MULTIPASS_HOST=`cat /etc/hosts | grep multipass-host`
echo $MULTIPASS_HOST
if [ -z "$MULTIPASS_HOST" ]; then
    sudo /bin/echo "$MULTIPASS_HOST_IP multipass-host" >> /etc/hosts
else
    sudo /usr/bin/sed -i "" "s/^[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\} multipass-host$/$MULTIPASS_HOST_IP multipass-host/" /etc/hosts
fi
MULTIPASS_HOST_CL=`multipass exec primary -- cat /etc/hosts | grep multipass-host`
echo $MULTIPASS_HOST_CL
if [ -z "$MULTIPASS_HOST_CL" ]; then
    multipass exec primary -- sudo su - -c "echo \"$MULTIPASS_HOST_IP multipass-host\" >> /etc/hosts"
else
    multipass exec primary -- sudo su - -c "cp /etc/hosts /etc/hosts_back; sed -i \"s/^[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\} multipass-host$/$MULTIPASS_HOST_IP multipass-host/\" /etc/hosts_back"
    multipass exec primary -- sudo su - -c "cp /etc/hosts_back /etc/hosts"
fi

# MACのIPアドレスをmultipassのhostsファイルへ登録
MAC_ADDR=`networksetup -getinfo Wi-Fi | grep '^IP address:' | awk '{ print $3 }'`
HOSTS=`multipass exec primary -- cat /etc/hosts | grep host.docker.internal`
echo $HOSTS
if [ -z "$HOSTS" ]; then
    multipass exec primary -- sudo su - -c "echo \"$MAC_ADDR host.docker.internal\" >> /etc/hosts"
else
    multipass exec primary -- sudo su - -c "cp /etc/hosts /etc/hosts_back; sed -i \"s/^[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\} host\.docker\.internal$/$MAC_ADDR host.docker.internal/\" /etc/hosts_back"
    multipass exec primary -- sudo su - -c "cp /etc/hosts_back /etc/hosts"
fi

## multipass内のdaemon.jsonにinsecure-registries登録
#multipass exec primary -- sudo su - -c "echo '{' > /etc/docker/daemon.json"
#multipass exec primary -- sudo su - -c "echo '  \\\"insecure-registries\\\" : [\\\"$MULTIPASS_HOST_IP:32000\\\"]' >> /etc/docker/daemon.json"
#multipass exec primary -- sudo su - -c "echo '}' >> /etc/docker/daemon.json"

## multipass内のregistry登録
#multipass exec primary -- sudo su - -c "sed -i \"s/^      \[plugins\.\\\"io\.containerd\.grpc\.v1\.cri\\\"\.registry\.mirrors\.\\\"[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}:32000\\\"\]$/      [plugins.\\\"io.containerd.grpc.v1.cri\\\".registry.mirrors.\\\"$MULTIPASS_HOST_IP:32000\\\"]/\" /var/snap/microk8s/current/args/containerd-template.toml"
#multipass exec primary -- sudo su - -c "sed -i \"s|^        endpoint = \[\\\"http:\/\/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}:32000\\\"\]$|        endpoint = [\\\"http://$MULTIPASS_HOST_IP:32000\\\"]|\" /var/snap/microk8s/current/args/containerd-template.toml"

# k8sのnfsマウント
if [ ! -e /Volumes/nfs/k8s ] ; then
    sudo /bin/mkdir -p /Volumes/nfs/k8s
fi
MOUNT_NFS=`mount -v | grep /Volumes/nfs/k8s`
if [ -z "$MOUNT_NFS" ]; then
    sudo /sbin/mount -t nfs -o rw,resvport $MULTIPASS_HOST_IP:/var/nfs/k8s /Volumes/nfs/k8s
fi
