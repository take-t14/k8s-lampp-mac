#!/bin/bash

MOUNT_NFS=`mount -v | grep /Volumes/nfs/k8s`
if [ -n "$MOUNT_NFS" ]; then
    sudo /sbin/umount /Volumes/nfs/k8s
fi

MULTIPASS=`multipass ls | grep primary | grep Running` #起動状態を表示
echo $MULTIPASS
if [ -n "$MULTIPASS" ]; then #起動状態
    echo "multipass stoping..."
    multipass stop primary #終了
fi
