#!/bin/bash

#### namespace切り替え
kubectl config set-context microk8s --namespace=k8s-lampp-mac  

#### ＜postgreSQL削除＞
##### postgreSQLイメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/3.psql-rebuild
kubectl delete -f k8s-sv.yaml

#### ＜MySQL削除＞
##### MySQLイメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/4.mysql-rebuild
kubectl delete -f k8s-sv.yaml

#### ＜DNS(bind)削除＞
##### DNS(bind)イメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/5.dns
kubectl delete -f k8s-sv.yaml

#### ＜php削除＞
##### php5イメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/9.php5-rebuild
kubectl delete -f k8s-sv.yaml

##### php7イメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/10.php7-rebuild
kubectl delete -f k8s-sv.yaml

##### php8イメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/11.php8-rebuild
kubectl delete -f k8s-sv.yaml

#### ＜apache削除＞
##### apacheイメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/8.apache-rebuild
kubectl delete -f k8s-sv.yaml

#### ＜mailsv削除＞
##### mailsvイメージ削除
cd ~/Documents/Kubernetes/k8s-lampp-mac/7.mailsv-rebuild
kubectl delete -f ./k8s-sv.yaml

#### ＜DBのpvc削除＞
cd ~/Documents/Kubernetes/k8s-lampp-mac/1.db-disk
kubectl delete -f 1.PersistentVolume.yaml
kubectl delete -f 2.PersistentVolumeClaim.yaml

#### secretの削除
##### キーの作成は以下のようにして行う
##### echo -n "database_user" | base64
##### echo -n "database_password" | base64
##### echo -n "secret_key_base" | base64
kubectl delete -f 3.php-apache-psql-secret.yaml

#### ＜src-deployのpvc削除＞
cd ~/Documents/Kubernetes/k8s-lampp-mac/2.src-deploy-disk

#### PersistentVolumeの削除
kubectl delete -f 1.PersistentVolume.yaml

#### PersistentVolumeClaimの削除
kubectl delete -f 2.PersistentVolumeClaim.yaml

#### sshの鍵削除
kubectl delete secret ssh-keys  

#### sslの鍵削除 ※HTTPSを使用する際は実施
##### kubectl delete secret tls example1.co.jp

cd ~/Documents/Kubernetes/k8s-lampp-mac/6.ingress
#### Ingressの削除
kubectl delete -f 80.ingress.yaml

#### namespace切り替え
kubectl config set-context microk8s --namespace=k8s-lampp-mac  

#### namespace削除
kubectl delete namespace k8s-lampp-mac
