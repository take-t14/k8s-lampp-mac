__**************************************************************************************__  
__*　Docker for Mac におけるLAPP環境構築__  
__**************************************************************************************__  
  
__**************************************************************************************__  
__*　ファイル構成__  
__**************************************************************************************__  

k8s-lampp-mac/  
　┣1.db-disk/・・・DBの永続ボリュームを作成するyaml等  
　┣2.src-deploy-disk/・・・srcの永続ボリュームを作成するyaml等  
　┣3.psql-rebuild/・・・postgreSQLのコンテナ、service、deployment等を作成するyaml等  
　┣4.mysql-rebuild/・・・MySQLのコンテナ、service、deployment等を作成するyaml等  
　┣5.dns/・・・DNS(bind)のコンテナ、service、deployment等を作成するyaml等  
　┣6.ingress/・・・ingressのyaml等  
　┣7.mailsv-rebuild/・・・postfixのコンテナ、service、deployment等を作成するyaml等  
　┣8.apache-rebuild/・・・apacheのコンテナ、service、deployment等を作成するyaml等  
　┣9.php5-rebuild/・・・php-fpm(php5)のコンテナ、service、deployment等を作成するyaml等  
　┣10.php7-rebuild/・・・php-fpm(php7)のコンテナ、service、deployment等を作成するyaml等  
　┣11.php8-rebuild/・・・php-fpm(php8)のコンテナ、service、deployment等を作成するyaml等  
　┣k8s-lampp-all-build.sh・・・k8s-lampp-macのk8sコンテナを一斉に作成するシェル  
　┣k8s-lampp-all-remove.sh・・・k8s-lampp-macのk8sコンテナを一斉に削除するシェル  
　┣kube-mysql-proxy.sh・・・podのMySQLへDBクライアント（A5等）から接続する為のポートフォワード起動  
　┣kube-psql-proxy.sh・・・podのpostgreSQLへDBクライアント（A5等）から接続する為のポートフォワード起動  
　┣kube-db-proxy.sh・・・kube-mysql-proxy.shとkube-psql-proxy.shを起動するスクリプト  
　┣kube-db-proxy.app・・・kube-db-proxy.shを起動するアプリ  
　┣kubeproxy.sh・・・kubernetesダッシュボードへアクセスする為のproxyを実行するスクリプト  
　┣kubeproxy.app・・・kubeproxy.shを起動するアプリ  
　┗ReadMe.md・・・使い方等々の説明  

__**************************************************************************************__  
__*　前提条件：この設定ファイルの環境要件__  
__**************************************************************************************__  

【環境要件】  
◆OS  
・Mac OS Big Sur 11.2.2  
  
◆ソフトウェア  
・multipass  1.7.0+mac
・multipassd 1.7.0+mac
・Kubernetes v1.21.4（※１）  
・skaffold 1.1.0（※２）  
・Homebrew 3.2.11  

（※１）記載のバージョンでないと動作しない。microk8sのinstall時に「--channel=1.21/stable」を指定する事。  
（※２）こちらも記載のバージョンでないと動作しない。skaffoldは以下コマンドでバージョン固定しているので、意識しなくてもこのバージョンが入ります。  

__**************************************************************************************__  
__*　kubernetesを動かす基盤となるソフトウェアのインストール（全てUbuntu 18.04 LTSで実施）__  
__*　※ 1回だけ実施すればよい。__  
__**************************************************************************************__  

#### # k8s-lampp-macのフォルダの中身を「~/Documents/Kubernetes/k8s-lampp-mac」へ配置する。

#### # ターミナルでHomebrewをインストール（未インストールの場合のみ）
##### ＜参考＞
##### # https://brew.sh/index_ja
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  
  
#### # ターミナルでskaffoldインストール
##### ＜参考＞
##### # https://qiita.com/yakisuzu/items/caf5557ba059bb88f0fe
brew install skaffold@1.1.0  
  
##### # multipassのインストール＆インスタンス作成
mac$ brew install multipass --cask  
mac$ multipass launch --mem 4G --disk 50G --cpus 2 --name primary  
※以下2つのコマンドでprimaryのIPアドレスを確認。以降primaryのIPアドレスを192.168.64.24と仮定して設定する  
mac$ multipass info primary  
mac$ multipass ls  
  
##### # NFSインストール＆セットアップ
###### # https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nfs-mount-on-ubuntu-20-04-ja
※primaryへ接続  
mac$ multipass shell primary  
multipass@primary:~$ sudo apt update  
multipass@primary:~$ sudo apt install -y nfs-kernel-server  
multipass@primary:~$ sudo mkdir -p /var/nfs/k8s  
multipass@primary:~$ ls -la /var/nfs/k8s  
multipass@primary:~$ sudo chown -R nobody:nogroup /var/nfs/k8s  
multipass@primary:~$ sudo chmod -R a+w /var/nfs/k8s  
multipass@primary:~$ sudo nano /etc/exports  
```
/var/nfs/k8s    *(rw,sync,all_squash,anonuid=1000,anongid=1000)
```
multipass@primary:~$ sudo systemctl restart nfs-kernel-server  
multipass@primary:~$ sudo systemctl enable nfs-kernel-server  
multipass@primary:~$ sudo systemctl restart rpc-statd.service  
multipass@primary:~$ sudo systemctl enable rpc-statd.service  
※Ctrl+Dでシェルを終了  

##### # microk8sインストール＆セットアップ
※インストール可能なmicrok8sのバージョンを確認  
mac$ multipass shell primary  
multipass@primary:~$ snap info microk8s  
multipass@primary:~$ sudo snap install microk8s --classic --channel=1.21/stable  
multipass@primary:~$ sudo iptables -P FORWARD ACCEPT  
multipass@primary:~$ sudo usermod -a -G microk8s $USER  
multipass@primary:~$ sudo chown -f -R $USER ~/.kube  
※Ctrl+Dで一度シェルを終了後、multipass shell primaryで再度接続  
multipass@primary:~$ microk8s.enable registry dns dashboard ingress  
multipass@primary:~$ ls /var/snap/microk8s/current/args/  
multipass@primary:~$ cat /var/snap/microk8s/current/args/containerd  
multipass@primary:~$ sudo apt-get update  
multipass@primary:~$ sudo apt-get install -y docker.io  
multipass@primary:~$ systemctl status docker  
multipass@primary:~$ sudo mkdir /etc/systemd/system/docker.service.d/  
```
※1行目の「sudo sh -c 'cat > 〜」を実行した後、2〜５行目をペーストし、Ctrl+Cボタンを押下する
multipass@primary:~$ sudo sh -c 'cat > /etc/systemd/system/docker.service.d/startup_options.conf'
# /etc/systemd/system/docker.service.d/override.conf
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2376
※Ctrl+Cでヒアドキュメント終了
```
※設定内容確認  
multipass@primary:~$ cat /etc/systemd/system/docker.service.d/startup_options.conf  
multipass@primary:~$ sudo systemctl daemon-reload  
multipass@primary:~$ sudo systemctl restart docker.service  
multipass@primary:~$ sudo snap install kubectl --classic  
multipass@primary:~$ microk8s.config > /home/$USER/.kube/config  

###### # multipass内のdaemon.jsonにinsecure-registries登録
multipass@primary:~$ sudo su - -c "echo '{' > /etc/docker/daemon.json"
multipass@primary:~$ sudo su - -c "echo '  \"insecure-registries\" : [\"multipass-host:32000\"]' >> /etc/docker/daemon.json"
multipass@primary:~$ sudo su - -c "echo '}' >> /etc/docker/daemon.json"

###### # multipass内のregistry登録
multipass@primary:~$ vim /var/snap/microk8s/current/args/containerd-template.toml  
```
※「[plugins."io.containerd.grpc.v1.cri".registry.mirrors]」の下に以下を追記
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors."multipass-host:32000"]
        endpoint = ["http://multipass-host:32000"]
```
multipass@primary:~$ microk8s stop; microk8s start
※Ctrl+Dでシェルを終了  
mac$ multipass exec primary -- /snap/bin/microk8s.config > ~/.kube/microk8s.kubeconfig  
  
##### # Docker、kubectl、skaffoldの向き先設定
vi ~/.zprofile  
※以下を追記  
```
source ~/Documents/Kubernetes/k8s-lampp-mac/multipass-envinit.sh
```
source ~/.zprofile  
  
##### # multipass再起動
mac$ cd ~/Documents/Kubernetes/k8s-lampp-mac/  
mac$ ./multipass-restart.sh  
  
##### # microk8sのdashboardのproxy起動
mac$ cd ~/Documents/Kubernetes/k8s-lampp-mac/  
mac$ ./kubeproxy.sh  
※FireFoxで以下へアクセス（危険を承知して表示するボタンを押下）  
https://multipass-host:10443/#/login  
  
  
#### # kuberctlインストール
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -   
echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list  
sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl kubernetes-cni  
  
  
__**************************************************************************************__  
__*　kubernetesでLAPP環境構築する手順__  
__*　※ 1回だけ実施すれば良い。__  
__*　kubernetesの環境を作り直したい場合は以下で作成した環境を一度削除し、__  
__*　もう一度実施する事も可能。phpのpodだけ削除して作り直すことも可能だし、__  
__*　skaffoldを使っている箇所は設定を変更してskaffold_run.shを実行するだけで反映される。__  
__**************************************************************************************__  

__*******************************************__  
__*　スクリプトで実行する場合__  
__*******************************************__  
cd ~/Documents/Kubernetes/k8s-lampp-mac  
./k8s-lampp-all-build.sh  

__※スクリプトで実行する場合は、以下「手動で実行する場合」は実施不要__

__*******************************************__  
__*　手動で実行する場合__  
__*******************************************__  

#### # クラスタの確認
kubectl config get-clusters  

#### # コンテキストの確認
kubectl config get-contexts  

#### # コンテキストの向き先確認
kubectl config current-context  

#### # namespace作成
kubectl create namespace k8s-lampp-mac  

#### # namespace確認
kubectl get namespace  

#### # namespace切り替え
kubectl config current-context  
##### # 上記コマンドで表示されたコンテキスト名を、以下のコマンドset-contextの次に組み込む。  
##### # namespaceには、切り替えたいnamespaceを設定する。  
kubectl config set-context microk8s --namespace=k8s-lampp-mac  

#### # コンテキストの向き先確認
kubectl config get-contexts  

#### ＜DBのpvc構築＞
##### ＜参考＞
##### # https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/  
##### # https://systemkd.blogspot.com/2018/02/docker-for-mac-kubernetes-ec-cube_12.html  

#### # PersistentVolumeClaimの構築
cd ~/Documents/Kubernetes/k8s-lampp-mac/1.db-disk  
kubectl apply -f 1.PersistentVolume.yaml  
kubectl apply -f 2.PersistentVolumeClaim.yaml  

#### # PersistentVolumeが作成されているかを確認
kubectl get pv  

#### # PersistentVolumeClaimが作成されているかを確認
kubectl get pvc  

#### # secretの作成
##### # キーの作成は以下のようにして行う
##### # echo -n "database_user" | base64
##### # echo -n "database_password" | base64
##### # echo -n "secret_key_base" | base64
kubectl apply -f 3.php-apache-psql-secret.yaml  

#### # pod一覧
kubectl get pod  

#### ＜src-deployのpvc構築＞
cd ~/Documents/Kubernetes/k8s-lampp-mac/2.src-deploy-disk  

#### # PersistentVolumeの構築
kubectl apply -f 1.PersistentVolume.yaml  

#### # PersistentVolumeClaimの構築
kubectl apply -f 2.PersistentVolumeClaim.yaml  

#### # PersistentVolumeが作成されているかを確認
kubectl get pv  
 または  
kubectl -n k8s-lampp-mac get pv  

#### # PersistentVolumeClaimが作成されているかを確認
kubectl get pvc  
 または  
kubectl -n k8s-lampp-mac get pvc  

#### # 全イメージを表示する．
docker images  

#### sshの鍵登録 ※要事前に2.src-deploy-disk\ssh-keysへSSHの鍵配備
kubectl create secret generic ssh-keys --from-file=./ssh-keys/id_rsa --from-file=./ssh-keys/id_rsa.pub  

#### ＜php-srcのボリュームへチェックアウト＞
##### # ~/Documents/Kubernetes/k8s-lampp-mac/2.src-deploy-disk\storage
##### # ※ ここで各プロジェクトのソースコードをチェックアウトする

#### ＜postgreSQL構築＞
##### # postgreSQLイメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/3.psql-rebuild  
./skaffold_run.sh  

#### ＜MySQL構築＞
##### # MySQLイメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/4.mysql-rebuild  
./skaffold_run.sh  

#### ＜DNS(bind)構築＞
##### # DNS(bind)イメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/5.dns  
./skaffold_run.sh  

#### ＜ingressを構築＞
#### # Ingress Controllerの作成
##### # 参考サイト：https://kubernetes.github.io/ingress-nginx/deploy/
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.48.1/deploy/static/provider/cloud/deploy.yaml
cd ~/Documents/Kubernetes/k8s-lampp-mac/6.ingress  

#### # Ingressの作成
kubectl apply -f 80.ingress.yaml  

#### # ingressに割り振られたグローバルアドレスの確認
kubectl get ingress  

#### ＜mailsv構築＞
##### # mailsvイメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/7.mailsv-rebuild  
kubectl apply -f ./k8s-mailsv-sv.yaml  

#### ＜apache構築＞
##### # apacheイメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/8.apache-rebuild  
./skaffold_run.sh  

#### ＜php構築＞
##### # php5イメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/9.php5-rebuild  
./skaffold_run.sh  

##### # php7イメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/10.php7-rebuild  
./skaffold_run.sh  

##### # php8イメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/11.php8-rebuild  
./skaffold_run.sh  

#### sslの鍵登録 ※HTTPSを使用する際は実施
##### # kubectl create secret tls example1.co.jp --key ../8.apache-rebuild/ssl/example1.co.jp/svrkey-sample-empty.key --cert ../8.apache-rebuild/ssl/example1.co.jp/svrkey-sample-empty.crt

__**************************************************************************************__  
__*　以下はkubernetesを操作する際によく使うコマンド__  
__**************************************************************************************__  

#### # k8s-lampp-macをネームスペースごとすべて削除
./k8s-lampp-all-remove.sh

#### # namespace切り替え
kubectl config current-context  
#### # 上記コマンドで表示されたコンテキスト名を、以下のコマンドに組み込む
kubectl config set-context microk8s --namespace=k8s-lampp-mac   

#### # コンテキストの向き先確認
kubectl config get-contexts  

#### # コンテキストの削除
kubectl config delete-context k8s-lampp-mac  

#### # pod一覧
kubectl get pod -n k8s-lampp-mac  

#### # init-data.shの実行
##### # init-data.shはpod起動時に自動で実行される。pod稼働中に必要になった場合に以下を実行する。
kubectl exec -it [podの名称] /bin/bash    
kubectl exec -it `kubectl get pod -n k8s-lampp-mac | grep php7-fpm | grep Running | awk -F " " '{print $1}'` /bin/bash -n k8s-lampp-mac  
kubectl exec -it `kubectl get pod -n k8s-lampp-mac | grep php8-fpm | grep Running | awk -F " " '{print $1}'` /bin/bash -n k8s-lampp-mac  
kubectl exec -it `kubectl get pod -n k8s-lampp-mac | grep apache | grep Running | awk -F " " '{print $1}'` /bin/bash -n k8s-lampp-mac  
kubectl exec -it apache-64999bb6b4-lt4j4 /bin/bash -n k8s-lampp-mac  
kubectl exec -it nuxt-8699dfcfc4-6kmt9 /bin/bash -n k8s-lampp-mac  
kubectl exec -it postgresql-0 /bin/bash -n k8s-lampp-mac  
kubectl exec -it postfix-77d69ff664-5drvf /bin/bash -n k8s-lampp-mac  
kubectl exec -it `kubectl get pod -n k8s-lampp-mac | grep dns | grep Running | awk -F " " '{print $1}'` /bin/bash -n k8s-lampp-mac  
kubectl exec -it mysql-0 /bin/bas -n k8s-lampp-mac  
kubectl exec -it php5-fpm-7d56f8dc44-rr5jw /bin/bash -n k8s-lampp-mac  


#### # ポートフォワード（postgreSQLへの接続時等に使用）
kubectl port-forward postgresql-0 5432:5432  


__**************************************************************************************__  
__*　トラブルシューティング__  
__**************************************************************************************__  

#### # kubectl get podとして「The connection to the server localhost:6445 was refused - did you specify the right host or port?」と出た場合
##### # Docker for Macの設定画面を開き、左下がKubernetes is runningとなってから再度試す。それでもダメな場合は以下を試す。
##### # docker ps --no-trunc | grep 'advertise-address='  
##### # 「--secure-port=」以降のポートを確認。以下コマンドの[PORT]へ組み込んで実行
##### # kubectl config set-cluster docker-desktop-cluster --server=https://localhost:[PORT]  

#### # kubectl get podとして「Unable to connect to the server: x509: certificate signed by unknown authority」と出た場合
mv ~/.kube/config ~/.kube/config_back  
ln -s /mnt/c/Users/<ユーザ名>/.kube/config ~/.kube/config  

