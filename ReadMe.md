__**************************************************************************************__  
__*　Docker for Mac におけるLAPP環境構築__  
__**************************************************************************************__  
  
  
#### # この設定ファイルを作成したブログ記事  
https://www.d-a.co.jp/staff/index.php?itemid=11051  

__**************************************************************************************__  
__*　ファイル構成__  
__**************************************************************************************__  

k8s-lampp-mac/  
　┣1.db-disk/・・・DBの永続ボリュームを作成するyaml等  
　┣2.src-deploy-disk/・・・srcの永続ボリュームを作成するyaml等  
　┣3.psql-rebuild/・・・postgreSQLのコンテナ、service、deployment等を作成するyaml等  
　┣4.mysql-rebuild/・・・MySQLのコンテナ、service、deployment等を作成するyaml等  
　┣5.dns/・・・DNS(bind)のコンテナ、service、deployment等を作成するyaml等  
　┣6.php7-rebuild/・・・php-fpm(php7)のコンテナ、service、deployment等を作成するyaml等  
　┣7.php5-rebuild/・・・php-fpm(php5)のコンテナ、service、deployment等を作成するyaml等  
　┣8.apache-rebuild/・・・apacheのコンテナ、service、deployment等を作成するyaml等  
　┣9.nuxt-rebuild/・・・nuxtのコンテナ、service、deployment等を作成するyaml等  
　┣10.mailsv-rebuild/・・・postfixのコンテナ、service、deployment等を作成するyaml等  
　┣11.ingress/・・・ingressのyaml等  
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
・macOS Catalina 10.15.1  

◆ソフトウェア  
・Docker for Mac 2.1.0.5  
・Homebrew 2.2.2  
・skaffold 1.1.0  

__**************************************************************************************__  
__*　kubernetesを動かす基盤となるソフトウェアのインストール（全てUbuntu 18.04 LTSで実施）__  
__*　※ 1回だけ実施すればよい。__  
__**************************************************************************************__  

#### # k8s-lampp-macのフォルダの中身を「~/Documents/Kubernetes/k8s-lampp-mac」へ配置する。

#### # Docker for Macをインストールし、設定画面でkubernetesを有効にする。

以下をチェックON  
・Enable Kubernetes  
・Deploy Docker Stack to Kubernetes by default  
・Show system containers  

#### # ターミナルでHomebrewをインストール（未インストールの場合のみ）
##### ＜参考＞
##### # https://brew.sh/index_ja
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  

#### # ターミナルでskaffoldインストール
##### ＜参考＞
##### # https://qiita.com/yakisuzu/items/caf5557ba059bb88f0fe
brew install skaffold@1.1.0  

#### # kuberctlインストール
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -   
echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list  
sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl kubernetes-cni  

#### # ダッシュボードインストール（1回だけ実施すればよい）
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml  

#### # kubectl proxyを実行（ダッシュボード閲覧に必要）
kubectl proxy  

#### # ダッシュボードへアクセス
http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/  

#### # 権限取得
kubectl -n kube-system get secret  

#### # 認証トークン取得（取得したTokenをサインイン画面のトークンで設定してサインインする方式）
kubectl -n kube-system describe secret default  

#### # 認証トークン設定（取得したTokenからkubeconfigを出力し、そのファイルを指定してサインインする方式。）
##### # 以下のコマンドの[TOKEN]へ取得した認証トークンを設定する。
##### # kubectl config set-credentials docker-desktop --token="[TOKEN]"

#### # ダッシュボードのサインインの画面で、~\.kube\configを指定するとサインイン出来る。


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
kubectl config set-context docker-desktop --namespace=k8s-lampp-mac  

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

#### ＜php構築＞
##### # php7イメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/6.php7-rebuild  
./skaffold_run.sh  

##### # php5イメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/7.php5-rebuild  
./skaffold_run.sh  

#### ＜apache構築＞
##### # apacheイメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/8.apache-rebuild  
./skaffold_run.sh  

#### ＜nuxt構築＞
##### # nuxtイメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/9.nuxt-rebuild  
./skaffold_run.sh  

#### ＜mailsv構築＞
##### # mailsvイメージビルド
cd ~/Documents/Kubernetes/k8s-lampp-mac/10.mailsv-rebuild  
kubectl apply -f ./k8s-mailsv-sv.yaml  

#### ＜ingressを構築＞
#### # Ingress Controllerの作成
##### # 参考サイト：https://kubernetes.github.io/ingress-nginx/deploy/
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.25.0/deploy/static/mandatory.yaml  
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.25.0/deploy/static/provider/cloud-generic.yaml
cd ~/Documents/Kubernetes/k8s-lampp-mac/11.ingress  

#### sslの鍵登録 ※HTTPSを使用する際は実施
##### # kubectl create secret tls example1.co.jp --key ../8.apache-rebuild/ssl/example1.co.jp/svrkey-sample-empty.key --cert ../8.apache-rebuild/ssl/example1.co.jp/svrkey-sample-empty.crt

#### # Ingressの作成
kubectl apply -f 80.ingress.yaml  

#### # ingressに割り振られたグローバルアドレスの確認
kubectl get ingress  

__**************************************************************************************__  
__*　以下はkubernetesを操作する際によく使うコマンド__  
__**************************************************************************************__  

#### # k8s-lampp-macをネームスペースごとすべて削除
./k8s-lampp-all-remove.sh

#### # namespace切り替え
kubectl config current-context  
#### # 上記コマンドで表示されたコンテキスト名を、以下のコマンドに組み込む
kubectl config set-context docker-desktop --namespace=k8s-lampp-mac  

#### # コンテキストの向き先確認
kubectl config get-contexts  

#### # コンテキストの削除
kubectl config delete-context docker-for-desktop  

#### # pod一覧
kubectl get pod  

#### # init-data.shの実行
##### # init-data.shはpod起動時に自動で実行される。pod稼働中に必要になった場合に以下を実行する。
kubectl exec -it [podの名称] /bin/bash  
kubectl exec -it php-fpm-7777b55996-n8s88 /bin/bash  
kubectl exec -it apache-64999bb6b4-lt4j4 /bin/bash  
kubectl exec -it nuxt-8699dfcfc4-6kmt9 /bin/bash  
kubectl exec -it postgresql-0 /bin/bash  
kubectl exec -it postfix-77d69ff664-5drvf /bin/bash  
kubectl exec -it dns-6b8bb6b759-rkn25 /bin/bash 
kubectl exec -it mysql-0 /bin/bash 
kubectl exec -it php5-fpm-7d56f8dc44-rr5jw /bin/bash  


#### # ポートフォワード（postgreSQLへの接続時等に使用）
kubectl port-forward postgresql-0 5432:5432  


__**************************************************************************************__  
__*　トラブルシューティング__  
__**************************************************************************************__  

#### # kubectl get podとして「The connection to the server localhost:6445 was refused - did you specify the right host or port?」と出た場合
##### # Docker for Macの設定画面を開き、左下がKubernetes is runningとなってから再度試す。それでもダメな場合は以下を試す。
docker ps --no-trunc | grep 'advertise-address='  
##### # 「--secure-port=」以降のポートを確認。以下コマンドの[PORT]へ組み込んで実行
kubectl config set-cluster docker-desktop-cluster --server=https://localhost:[PORT]  

#### # kubectl get podとして「Unable to connect to the server: x509: certificate signed by unknown authority」と出た場合
mv ~/.kube/config ~/.kube/config_back  
ln -s /mnt/c/Users/<ユーザ名>/.kube/config ~/.kube/config  

